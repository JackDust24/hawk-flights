'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const CookieConsent = () => {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const savedConsent = Cookies.get('cookie_consent');
    if (savedConsent) {
      setConsent(savedConsent === 'true');
    }
  }, []);

  const handleAccept = async () => {
    console.log('Accepting cookies');
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setConsent(true);

    await fetch(`${API_URL}/api/cookie-consent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ consent: 'true' }),
    });
  };

  const handleDecline = async () => {
    Cookies.set('cookie_consent', 'false', { expires: 365 });
    setConsent(false);

    await fetch(`${API_URL}/api/cookie-consent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ consent: 'false' }),
    });
  };

  if (consent !== null) return null;

  return (
    <div className='fixed bottom-0 w-full bg-black text-green-500 p-2 h-[8rem] text-lg text-center'>
      <p className='my-4'>
        This site uses cookies to improve your experience. Do you accept?
      </p>
      <div className='flex justify-center gap-4'>
        <Button onClick={handleAccept} variant='select'>
          Accept
        </Button>
        <Button variant='destructive' onClick={handleDecline}>
          Decline
        </Button>
      </div>
    </div>
  );
};

export default CookieConsent;
