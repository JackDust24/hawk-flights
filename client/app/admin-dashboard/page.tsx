'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useApi } from '../../app/api/useApi';
import PageLayout from '../_components/PageLayout';
import { getApiUrl } from '../../utils/api';

const API_URL = getApiUrl() ?? 'http://localhost:4000';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const { data: session, status } = useSession();
  const [isNeedToLogin, setIsNeedToLogin] = useState(false);

  const { fetchData, error } = useApi();

  useEffect(() => {
    if (user) return;
    if (session?.user.token) {
      const getUserData = async () => {
        const data = await fetchData(
          `${API_URL}/admin-dashboard`,
          session?.user.token
        );
        if (data) {
          setUser(data.user);
        }
      };

      getUserData();
    } else {
      setIsNeedToLogin(true);
    }
  }, []);

  return (
    <PageLayout title='Admin Dashboard'>
      {error && <p className='text-red-500'>{error}</p>}
      {user && (
        <div>
          <p>Welcome, {user.username}</p>
          <p>
            You are authorised to view this page as you have
            <span>admin access</span>
          </p>
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
