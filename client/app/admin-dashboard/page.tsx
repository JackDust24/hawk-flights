'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/app/api/useApi'; // Adjust path as needed
import { useSession } from 'next-auth/react';
import PageLayout from '../_components/PageLayout';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

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
      const timer = setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);

      return () => clearTimeout(timer);
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
        <p className='text-red-500'>You need to login to access this page</p>
      )}
    </PageLayout>
  );
}
