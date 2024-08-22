import { Flight, FlightType } from '@/app/lib/types';
import { FaPlaneDeparture, FaPlaneArrival } from 'react-icons/fa';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function FlightsResponseSkeleton() {
  return (
    <div className='animate-pulse overflow-hidden p-4 w-[40rem] border-2 rounded-xl shadow-sm cursor-pointer transition-all duration-300 bg-gray-300'>
      <div className='flex justify-between items-center mb-4'>
        <div className='flex items-center space-x-2'>
          <FaPlaneDeparture className='text-gray-600' />
          <div className='font-bold text-lg h-8 w-10 text-gray-600' />
        </div>
        <div className='text-right'>
          <div className='font-bold text-lg h-8 w-10 text-gray-600' />
          <div className='font-bold text-lg h-8 w-10 text-gray-600' />
        </div>
      </div>
      <div className='space-y-2'>
        <div className='font-bold text-lg h-8 w-10 text-gray-600' />
        <div className='font-bold text-lg h-8 w-10 text-gray-600' />
        <div className='font-bold text-lg h-8 w-10 text-gray-600' />
        <div className='font-bold text-lg h-8 w-10 text-gray-600' />
      </div>
      <div className='flex justify-end mt-4'>
        <Button
          variant='secondary'
          className='w-full text-gray-600'
          disabled
          size='lg'
        />
      </div>
    </div>
  );
}
