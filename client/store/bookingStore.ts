import { create } from 'zustand';
import { BookingInformation } from '../app/lib/types';

interface BookingStore {
  bookings: BookingInformation[];
  addBooking: (newBooking: BookingInformation) => void;
}

const defaultBookings: BookingInformation[] = [];

export const useBookingStore = create<BookingStore>((set, get) => {
  return {
    bookings: defaultBookings,
    addBooking: (newBooking) => {
      set((state) => ({
        bookings: [...state.bookings, newBooking],
      }));
    },
  };
});
