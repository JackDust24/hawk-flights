import { Flight, FlightType } from '@/app/lib/types';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function Response({
  flight,
  type,
  isSelected,
  onSelect,
}: {
  flight: Flight;
  type: FlightType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      key={flight.id}
      onClick={onSelect}
      className={`p-4 w-[40rem] border-2 rounded-xl shadow-sm cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-blue-100 border-blue-500'
          : 'bg-white border-gray-300 opacity-100 hover:opacity-90'
      }`}
    >
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          {type == 'outbound' ? (
            <FaPlaneDeparture className='text-blue-500' />
          ) : (
            <FaPlaneArrival className='text-blue-500' />
          )}
          <h3 className='font-bold text-lg'>
            {flight.origin} to {flight.destination}
          </h3>
        </div>
        <div className='text-right'>
          <p className='text-lg font-semibold'>${flight.price}</p>
          <p className='text-sm text-gray-500'>
            Flight No: {flight.flight_number}
          </p>
        </div>
      </div>
      <div className='space-y-2'>
        <p className='text-gray-600'>
          <span className='font-medium'>Date:</span>{' '}
          {new Date(flight.flight_date).toLocaleDateString()}
        </p>
        <p className='text-gray-600'>
          <span className='font-medium'>Time:</span> {flight.flight_time}
        </p>
        <p className='text-gray-600'>
          <span className='font-medium'>Stops:</span> {flight.stops}
        </p>
        <p className='text-gray-600'>
          <span className='font-medium'>Duration:</span> {flight.flight_length}{' '}
          hours
        </p>
      </div>
      <div className='flex justify-end mt-4'>
        <Button variant={isSelected ? 'destructive' : 'select'}>
          {isSelected ? 'Unselect' : 'Select'}
        </Button>
      </div>
    </div>
  );
}
