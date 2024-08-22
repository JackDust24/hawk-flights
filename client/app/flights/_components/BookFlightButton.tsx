import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

export function BookFlightButton() {
  return (
    <Link href='/booking'>
      <Button variant='select' className='px-6 py-3 h-12 rounded-full text-3xl'>
        Book Flight
      </Button>
    </Link>
  );
}
