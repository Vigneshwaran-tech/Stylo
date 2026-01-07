import React, { createContext, useContext, useState } from 'react';
import type { Shop, Service, Slot } from '../services/firestoreService';

interface BookingContextType {
  selectedShop: Shop | null;
  selectedServices: Service[];
  selectedDate: string | null;
  selectedSlot: Slot | null;
  setSelectedShop: (shop: Shop | null) => void;
  setSelectedServices: (services: Service[]) => void;
  setSelectedDate: (date: string | null) => void;
  setSelectedSlot: (slot: Slot | null) => void;
  clearBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  const clearBooking = () => {
    setSelectedShop(null);
    setSelectedServices([]);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  return (
    <BookingContext.Provider
      value={{
        selectedShop,
        selectedServices,
        selectedDate,
        selectedSlot,
        setSelectedShop,
        setSelectedServices,
        setSelectedDate,
        setSelectedSlot,
        clearBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
