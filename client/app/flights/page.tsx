'use client';
import { useFormState } from 'react-dom';
import { PageHeader } from '../_components/PageHeader';
import FlightsForm from './_components/FlightsForm';
import { searchFlight } from '@/actions/flights';
import { Flight, FlightsResponse } from '@/app/lib/types';
import Response from './_components/FlightsResponse';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useFlightStore } from '@/store/flightStore';
import FlightsResponseSkeleton from './_components/FlightsResponseSkeleton';
import { BookFlightButton } from './_components/BookFlightButton';

const initialState: FlightsResponse = {
  message: '',
  outbound: [],
  inbound: [],
};
export default function Flights() {
  const [isPending, startTransition] = useTransition();
  const [isResponseReceived, setIsResponseReceived] = useState(false);
  const [searchResult, setSearchResult] = useState<FlightsResponse | null>(
    null
  );
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

  const handleSubmitForm = (payload: FormData) => {
    startTransition(() => {
      action(payload);
    });
  };

  useEffect(() => {
    if (isPending) return;
  }, [isPending]);

  useEffect(() => {
    if (response?.message) {
      console.log('Response message:', response.message);
      setIsResponseReceived(true);
      if (response?.searchResult) {
        setSearchResult(response.searchResult);
      }
    }
  }, [response]);

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
        <FlightsForm
          onSubmit={handleSubmitForm}
          error={response?.fieldErrors}
        />
        <div className='flex flex-col items-center mx-auto gap-8 my-12'>
          {isPending && !isResponseReceived && (
            <>
              <FlightsResponseSkeleton />
              <FlightsResponseSkeleton />
              <FlightsResponseSkeleton />
            </>
          )}
          {response && !response.success && (
            <div className='text-center text-red-500'>{response.message}</div>
          )}
          {response && searchResult && searchResult.outbound.length > 0 && (
            <div className='space-y-8 w-full'>
              <h3 className='text-xl font-semibold text-center'>
                Please select an outbound flight
              </h3>
              <div className='flex flex-col items-center space-y-4'>
                {searchResult.outbound.map((flight: Flight, index: number) => (
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
          {response && searchResult && searchResult.inbound.length > 0 && (
            <div className='space-y-8 w-full' ref={inboundRef}>
              <h3 className='text-xl font-semibold text-center'>
                Please select a return flight
              </h3>
              <div className='flex flex-col items-center space-y-4'>
                {searchResult.inbound.map((flight: Flight, index: number) => (
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
            <BookFlightButton />
          </div>
        )}
      </div>
    </div>
  );
}
