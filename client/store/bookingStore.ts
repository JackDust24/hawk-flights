import create from 'zustand';
import { Flight } from '../lib/types';

type BookingStore = {
  selectedOutboundFlight: Flight | null;
  selectedInboundFlight: Flight | null;
  setSelectedOutboundFlight: (flight: Flight | null) => void;
  setSelectedInboundFlight: (flight: Flight | null) => void;
};

export const useBookingStore = create<BookingStore>((set) => ({
  selectedOutboundFlight: null,
  selectedInboundFlight: null,
  setSelectedOutboundFlight: (flight) =>
    set({ selectedOutboundFlight: flight }),
  setSelectedInboundFlight: (flight) => set({ selectedInboundFlight: flight }),
}));
