'use client';

import { useFormState } from 'react-dom';
import { PageHeader } from '../_components/PageHeader';
import FlightsForm from './_components/FlightsForm';
import { searchFlight } from '@/actions/flights';
import { Flight, FlightsResponse } from '@/app/lib/types';
import Response from './_components/Response';
import { useLayoutEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useFlightStore } from '@/store/flightStore';

const initialState: FlightsResponse = {
  message: '',
  outbound: [],
  inbound: [],
};

//TODO: Sort out the types
export default function Flights() {
  const [response, action] = useFormState(searchFlight, initialState);
  const {
    selectedInboundFlight,
    selectedOutboundFlight,
    setSelectedInboundFlight,
    setSelectedOutboundFlight,
  } = useFlightStore();

  const inboundRef = useRef<HTMLDivElement | null>(null);
  const bookFlightRef = useRef<HTMLDivElement | null>(null);

  const handleOutboundSelect = (flight: Flight) => {
    if (selectedOutboundFlight?.id === flight.id) {
      setSelectedOutboundFlight(null);
      return;
    }
    setSelectedOutboundFlight(flight);

    if (inboundRef.current) {
      inboundRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInboundSelect = (flight: Flight) => {
    if (selectedInboundFlight?.id === flight.id) {
      setSelectedInboundFlight(null);
      return;
    }
    setSelectedInboundFlight(flight);
  };

  useLayoutEffect(() => {
    if (
      selectedOutboundFlight &&
      selectedInboundFlight &&
      bookFlightRef.current
    ) {
      bookFlightRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedInboundFlight, selectedOutboundFlight]);

  return (
    <div className='flex min-h-screen h-full p-6 bg-gray-100'>
      <PageHeader>Flights</PageHeader>
      <div className='flex-grow mt-20'>
        <FlightsForm onSubmit={action} error={response} />
        <div className='flex flex-col items-center mx-auto gap-8 my-12'>
          {response && response.outbound && response.outbound.length > 0 && (
            <div className='space-y-8 w-full'>
              <h3 className='text-xl font-semibold text-center'>
                Please select an outbound flight
              </h3>
              <div className='flex flex-col items-center space-y-4'>
                {response.outbound.map((flight: Flight, index: number) => (
                  <Response
                    key={index}
                    flight={flight}
                    type='outbound'
                    isSelected={selectedOutboundFlight?.id === flight.id}
                    onSelect={() => handleOutboundSelect(flight)}
                  />
                ))}
              </div>
            </div>
          )}
          {response && response.inbound && response.inbound.length > 0 && (
            <div className='space-y-8 w-full' ref={inboundRef}>
              <h3 className='text-xl font-semibold text-center'>
                Please select a return flight
              </h3>
              <div className='flex flex-col items-center space-y-4'>
                {response.inbound.map((flight: Flight, index: number) => (
                  <Response
                    key={index}
                    flight={flight}
                    type='inbound'
                    isSelected={selectedInboundFlight?.id === flight.id}
                    onSelect={() => handleInboundSelect(flight)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {selectedOutboundFlight && selectedInboundFlight && (
          <div className='flex justify-center my-8 mb-16' ref={bookFlightRef}>
            <Link href='/booking'>
              <Button
                variant='select'
                className='px-6 py-3 h-12 rounded-full text-3xl'
              >
                Book Flight
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
