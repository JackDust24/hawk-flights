'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Button } from '../../components/ui/button';
import { getApiUrl } from '../../utils/api';

const API_URL = getApiUrl() ?? 'http://localhost:4000';

const CookieConsent = () => {
  const [consent, setConsent] = useState<boolean | null>(null);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const savedConsent = Cookies.get('cookie_consent');
    if (savedConsent) {
      setConsent(savedConsent === 'true');
    }
    setIsPageLoaded(true);
  }, []);

  const handleAccept = async () => {
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

  if (consent !== null || !isPageLoaded) return null;

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
