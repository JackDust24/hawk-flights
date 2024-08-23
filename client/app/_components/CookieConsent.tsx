'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Button } from '@/components/ui/button';
import axios from 'axios';

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
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setConsent(true);

    try {
      await axios.post(
        `${API_URL}/api/cookie-consent`,
        { consent: 'true' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err) {
      console.warn('Error with consent, not important issue - ', err);
    }
  };

  const handleDecline = async () => {
    Cookies.set('cookie_consent', 'false', { expires: 365 });
    setConsent(false);

    try {
      await axios.post(
        `${API_URL}/api/cookie-consent`,
        { consent: 'false' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err) {
      console.warn('Error with consent, not important issue - ', err);
    }
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
