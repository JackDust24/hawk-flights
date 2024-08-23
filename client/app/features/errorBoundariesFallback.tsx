'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PageLayout from '../_components/PageLayout';

const WAIT_DURATION = 3000;

type ErrorBoundaryFallbackProps = {
  onClick: () => void;
};

export function ErrorBoundaryFallback({ onClick }: ErrorBoundaryFallbackProps) {
  const [loading, setLoading] = useState(false);

  const handleReloadClick = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
      onClick();
    }, WAIT_DURATION);

    return () => clearTimeout(timer);
  };

  return (
    <PageLayout title='Problem with session'>
      <p className='font-light'>
        We have encountered a problem. Press Reload to try and redirect you to
        the home screen.
      </p>

      <Button
        onClick={handleReloadClick}
        className='w-fit rounded-lg bg-black p-6 text-2xl font-semibold text-white'
      >
        {loading ? 'Reloading...' : 'RELOAD'}
      </Button>
    </PageLayout>
  );
}
