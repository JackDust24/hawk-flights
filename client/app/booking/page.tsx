'use client';

import { PageHeader } from '../_components/PageHeader';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useFlightStore } from '@/store/flightStore';
import BookingForm from './_components/BookingForm';
import { ArrowRightIcon, CalendarIcon } from 'lucide-react';

export default function Booking() {
  const router = useRouter();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const {
    selectedInboundFlight,
    selectedOutboundFlight,
    reset: resetFlights,
  } = useFlightStore();

  const handleConfirm = () => {
    setShowBookingForm(true);
  };

  const handleCancel = () => {
    resetFlights();
    router.push('/flights');
  };

  if (!selectedOutboundFlight || !selectedInboundFlight) {
    router.push('/flights');
    return null;
  }

  const totalPrice = `${
    (selectedOutboundFlight.price || 0) + (selectedInboundFlight.price || 0)
  }`;

  return (
    <div className='flex flex-col min-h-screen p-6 bg-gray-100'>
      <PageHeader>Booking</PageHeader>
      <div className='flex flex-col md:flex-row justify-center gap-8 mb-8'>
        <div className='flex-1 bg-white p-6 rounded-lg shadow-md max-w-md'>
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <ArrowRightIcon className='mr-2 h-5 w-5 text-blue-600' />
            Selected Outbound Flight
          </h2>
          <div className='flex flex-col gap-4'>
            <p className='text-lg'>
              {selectedOutboundFlight.origin} -{' '}
              {selectedOutboundFlight.destination}
            </p>
            <p className='text-md'>
              <CalendarIcon className='inline mr-2 h-4 w-4 text-gray-600' />
              {selectedOutboundFlight.flight_time}
            </p>
            <p className='text-lg font-bold'>${selectedOutboundFlight.price}</p>
          </div>
        </div>

        <div className='flex-1 bg-white p-6 rounded-lg shadow-md max-w-md'>
          <h2 className='text-xl font-semibold mb-4 flex items-center'>
            <ArrowRightIcon className='mr-2 h-5 w-5 text-blue-600' />
            Selected Inbound Flight
          </h2>
          <div className='flex flex-col gap-4'>
            <p className='text-lg'>
              {selectedInboundFlight.origin} -{' '}
              {selectedInboundFlight.destination}
            </p>
            <p className='text-md'>
              <CalendarIcon className='inline mr-2 h-4 w-4 text-gray-600' />
              {selectedInboundFlight.flight_time}
            </p>
            <p className='text-lg font-bold'>${selectedInboundFlight.price}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center my-6'>
        <div className='text-2xl mb-4 font-semibold'>
          Total Price: ${totalPrice}
        </div>
        {!showBookingForm && (
          <div className='flex gap-4 mt-4 md:mt-0'>
            <Button onClick={handleConfirm} variant='select'>
              Confirm Flight
            </Button>
            <Button onClick={handleCancel} variant='destructive'>
              Cancel
            </Button>
          </div>
        )}
      </div>

      {showBookingForm && (
        <div className='flex flex-col items-center gap-4'>
          <h2 className='text-xl font-semibold text-center'>Booking Form</h2>
          <BookingForm totalPrice={totalPrice} />
        </div>
      )}
    </div>
  );
}
