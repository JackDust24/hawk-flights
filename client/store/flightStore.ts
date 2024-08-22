import { create } from 'zustand';
import { Flight } from '../app/lib/types';

interface FlightStore {
  selectedOutboundFlight: Flight | null;
  selectedInboundFlight: Flight | null;
  setSelectedOutboundFlight: (flight: Flight | null) => void;
  setSelectedInboundFlight: (flight: Flight | null) => void;
  reset: () => void;
}

export const useFlightStore = create<FlightStore>((set) => ({
  selectedOutboundFlight: null,
  selectedInboundFlight: null,
  setSelectedOutboundFlight: (flight) =>
    set({ selectedOutboundFlight: flight }),
  setSelectedInboundFlight: (flight) => set({ selectedInboundFlight: flight }),
  reset: () => {
    set(() => {
      return {
        selectedOutboundFlight: null,
        selectedInboundFlight: null,
      };
    });
  },
}));
