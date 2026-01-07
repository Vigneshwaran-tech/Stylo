import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  Timestamp,
  runTransaction,
} from 'firebase/firestore';
import { generateDateSlots } from '../utils/slotUtils';

// Types
export interface Shop {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  image?: string;
  openTime: string;
  closeTime: string;
  slotDuration: number; // in minutes
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
}

export interface Slot {
  id: string;
  shopId: string;
  time: string;
  date: string;
  available: boolean;
  serviceIds: string[];
}

export interface Booking {
  id: string;
  userId: string;
  shopId: string;
  serviceIds: string[];
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Timestamp;
}

// Shops Service
export const getShops = async (): Promise<Shop[]> => {
  try {
    const shopsRef = collection(db, 'shops');
    const snapshot = await getDocs(shopsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Shop));
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};

export const getShopById = async (shopId: string): Promise<Shop | null> => {
  try {
    const shopRef = doc(db, 'shops', shopId);
    const snapshot = await getDoc(shopRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Shop;
    }
    return null;
  } catch (error) {
    console.error('Error fetching shop:', error);
    throw error;
  }
};

// Services Service
export const getServices = async (shopId: string): Promise<Service[]> => {
  try {
    const servicesRef = collection(db, 'shops', shopId, 'services');
    const snapshot = await getDocs(servicesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

// Slots Service
export const getAvailableSlots = async (
  shopId: string,
  date: string
): Promise<Slot[]> => {
  try {
    const slotsRef = collection(db, 'shops', shopId, 'slots');
    const q = query(
      slotsRef,
      where('date', '==', date),
      where('available', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Slot));
  } catch (error) {
    console.error('Error fetching slots:', error);
    throw error;
  }
};

export const createSlot = async (
  shopId: string,
  slotData: Omit<Slot, 'id'>
): Promise<string> => {
  try {
    const slotsRef = collection(db, 'shops', shopId, 'slots');
    const docRef = await addDoc(slotsRef, slotData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating slot:', error);
    throw error;
  }
};

export const markSlotAsBooked = async (
  shopId: string,
  slotId: string
): Promise<void> => {
  try {
    const slotRef = doc(db, 'shops', shopId, 'slots', slotId);
    await updateDoc(slotRef, { available: false });
  } catch (error) {
    console.error('Error updating slot:', error);
    throw error;
  }
};

// Bookings Service
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const docRef = await addDoc(bookingsRef, {
      ...bookingData,
      createdAt: Timestamp.now(),
    });
    
    // Mark slot as booked
    await markSlotAsBooked(bookingData.shopId, bookingData.time);
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const snapshot = await getDoc(bookingRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Booking;
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: Booking['status']
): Promise<void> => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status });
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

// Generate and create slots for a shop on specific dates
export const generateAndCreateSlots = async (
  shopId: string,
  dates: string[],
  slotConfig: { openTime: string; closeTime: string; slotDuration: number }
): Promise<void> => {
  try {
    const slotsRef = collection(db, 'shops', shopId, 'slots');
    
    for (const date of dates) {
      const dateSlots = generateDateSlots(date, slotConfig);
      
      for (const slot of dateSlots) {
        // Check if slot already exists
        const existingQuery = query(
          slotsRef,
          where('date', '==', date),
          where('time', '==', slot.time)
        );
        const existing = await getDocs(existingQuery);
        
        if (existing.empty) {
          await addDoc(slotsRef, {
            shopId,
            date: slot.date,
            time: slot.time,
            available: true,
            serviceIds: [],
          });
        }
      }
    }
    console.log('Slots generated successfully');
  } catch (error) {
    console.error('Error generating slots:', error);
    throw error;
  }
};

// Safe booking with transaction to prevent race conditions
export const safeBookSlot = async (
  userId: string,
  shopId: string,
  date: string,
  time: string,
  serviceIds: string[]
): Promise<string> => {
  try {
    const slotId = `${date}-${time}`;
    const slotRef = doc(db, 'shops', shopId, 'slots', slotId);
    
    // Use transaction for atomic operations
    const bookingId = await runTransaction(db, async (transaction) => {
      // Read slot
      const slotSnap = await transaction.get(slotRef);
      
      if (!slotSnap.exists()) {
        throw new Error('Slot does not exist');
      }
      
      const slotData = slotSnap.data();
      if (!slotData.available) {
        throw new Error('Slot is already booked');
      }
      
      // Mark slot as unavailable
      transaction.update(slotRef, { available: false });
      
      // Create booking
      const bookingsRef = collection(db, 'bookings');
      const bookingData = {
        userId,
        shopId,
        serviceIds,
        date,
        time,
        status: 'confirmed' as const,
        createdAt: Timestamp.now(),
      };
      
      const newBookingRef = doc(bookingsRef);
      transaction.set(newBookingRef, bookingData);
      
      return newBookingRef.id;
    });
    
    return bookingId;
  } catch (error) {
    console.error('Error booking slot:', error);
    throw error;
  }
};
