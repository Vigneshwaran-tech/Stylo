import { db } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

// Seed test data
export const seedTestData = async () => {
  try {
    // Create sample shops
    const shopsData = [
      {
        name: 'Style Master Barber',
        address: '123 Main Street, Downtown',
        rating: 4.8,
        distance: '0.5 km',
        openTime: '09:00',
        closeTime: '18:00',
        slotDuration: 30,
        image: 'shop1.jpg',
      },
      {
        name: 'Classic Cuts Studio',
        address: '456 Oak Avenue, City Center',
        rating: 4.6,
        distance: '1.2 km',
        openTime: '10:00',
        closeTime: '19:00',
        slotDuration: 30,
        image: 'shop2.jpg',
      },
      {
        name: 'Elite Grooming',
        address: '789 Pine Road, Uptown',
        rating: 4.9,
        distance: '2.1 km',
        openTime: '08:00',
        closeTime: '20:00',
        slotDuration: 45,
        image: 'shop3.jpg',
      },
    ];

    // Add shops
    const shopsRef = collection(db, 'shops');
    const shopIds: string[] = [];

    for (const shop of shopsData) {
      const shopRef = doc(shopsRef);
      await setDoc(shopRef, shop);
      shopIds.push(shopRef.id);
      console.log(`Created shop: ${shop.name}`);
    }

    // Create services for each shop
    const servicesData = [
      { name: 'Haircut', duration: 30, price: 500 },
      { name: 'Beard Trim', duration: 20, price: 300 },
      { name: 'Full Grooming', duration: 60, price: 1000 },
      { name: 'Hair Coloring', duration: 45, price: 800 },
      { name: 'Shampoo & Style', duration: 25, price: 400 },
    ];

    for (const shopId of shopIds) {
      const servicesRef = collection(db, 'shops', shopId, 'services');
      for (const service of servicesData) {
        const serviceRef = doc(servicesRef);
        await setDoc(serviceRef, service);
      }
      console.log(`Created services for shop: ${shopId}`);
    }

    console.log('✅ Test data seeded successfully!');
    return shopIds;
  } catch (error) {
    console.error('Error seeding test data:', error);
    throw error;
  }
};
