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

export type FlightType = 'inbound' | 'outbound';
