'use client';

import { useFormState } from 'react-dom';
import { PageHeader } from '../_components/PageHeader';
import FlightsForm from './_components/FlightsForm';
import { searchFlight } from '@/actions/flights';
import { Flight, FlightsResponse } from '@/lib/types';
import Response from './_components/Response';
import { useLayoutEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

const initialState: FlightsResponse = {
  message: '',
  outbound: [],
  inbound: [],
};

//TODO: Sort out the types
export default function Flights() {
  const [response, action] = useFormState(searchFlight, initialState);
  const [selectedOutbound, setSelectedOutbound] = useState<Flight | null>(null);
  const [selectedInbound, setSelectedInbound] = useState<Flight | null>(null);
  const inboundRef = useRef<HTMLDivElement | null>(null);
  const bookFlightRef = useRef<HTMLDivElement | null>(null);

  const handleOutboundSelect = (flight: Flight) => {
    if (selectedOutbound?.id === flight.id) {
      setSelectedOutbound(null);
      return;
    }
    setSelectedOutbound(flight);
    if (inboundRef.current) {
      inboundRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInboundSelect = (flight: Flight) => {
    if (selectedInbound?.id === flight.id) {
      setSelectedInbound(null);
      return;
    }
    setSelectedInbound(flight);
  };

  useLayoutEffect(() => {
    if (selectedOutbound && selectedInbound && bookFlightRef.current) {
      bookFlightRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedInbound, selectedOutbound]);

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
                    isSelected={selectedOutbound?.id === flight.id}
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
                    isSelected={selectedInbound?.id === flight.id}
                    onSelect={() => handleInboundSelect(flight)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {selectedOutbound && selectedInbound && (
          <div className='flex justify-center my-8 mb-16' ref={bookFlightRef}>
            <Button
              variant='select'
              className='px-6 py-3 h-12 rounded-full text-3xl'
            >
              Book Flight
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
