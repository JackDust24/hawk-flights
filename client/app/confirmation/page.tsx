'use client';

import React, { useEffect } from 'react';
import PageLayout from '../_components/PageLayout';
import { useSearchParams } from 'next/navigation';
import { useFlightStore } from '@/store/flightStore';

export default function Confirmation() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const { reset: cleanupBooking } = useFlightStore();

  useEffect(() => {
    cleanupBooking();
  }, []);
  return (
    <PageLayout title='Confirmation'>
      <div>
        <p>Confirmation that your booking went through</p>
        {bookingId && (
          <p>
            Your booking ID is <strong>{bookingId}</strong>
          </p>
        )}
      </div>
    </PageLayout>
  );
}
