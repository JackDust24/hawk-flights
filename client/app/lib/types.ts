import { Type } from 'lucide-react';

export type Flight = {
  id: string;
  origin: string;
  destination: string;
  flight_date: string;
  flight_time: string;
  stops: number;
  flight_length: number;
  price: number;
  flight_number: string;
};

export type FlightsResponse = {
  message: string;
  outbound: Flight[];
  inbound: Flight[];
};

export type PaymentData = {
  fullname: string;
  email: string;
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
  bankName: string;
  nameOnAccount: string;
};

export type BookingInformation = {
  flightDetails: Flight[];
  bookingId: string;
  totalPrice: string;
  fullname: string;
  email: string;
  paid: boolean;
};

export type FlightType = 'inbound' | 'outbound';
