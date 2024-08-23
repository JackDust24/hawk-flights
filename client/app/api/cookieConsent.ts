'use client';

import Cookies from 'js-cookie';

export function setCookieConsent() {
  const consent = Cookies.get('cookie_consent');
  if (consent === 'true') {
    Cookies.set('analytics_cookie', 'some_value', { expires: 365 });
  }
}
