'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PageLayout from '../_components/PageLayout';
import { getApiUrl } from '../../utils/api';
import { useApi } from '../../app/api/useApi';

const API_URL = getApiUrl() ?? 'http://localhost:4000';

export default function Profile() {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<any>(null);
  const { fetchData, error } = useApi();
  const [isNeedToLogin, setIsNeedToLogin] = useState(false);

  useEffect(() => {
    if (user) return;
    if (session?.user.token) {
      const getProfileData = async () => {
        const data = await fetchData(`${API_URL}/profile`, session?.user.token);
        if (data) {
          setUser(data.user);
        }
      };

      getProfileData();
    } else {
      setIsNeedToLogin(true);
    }
  }, []);

  return (
    <PageLayout title='Profile'>
      {error && <p className='text-red-500'>{error} Please sign in</p>}
      {user && (
        <div>
          <p>Welcome, {user.username}</p>
          <p>You are authorised to view this page</p>
        </div>
      )}
      {isNeedToLogin && (
        <p className='text-red-500'>
          You need to{' '}
          <Link href='/signin' className='underline font-bold'>
            Log in
          </Link>{' '}
          to access this page
        </p>
      )}
    </PageLayout>
  );
}
