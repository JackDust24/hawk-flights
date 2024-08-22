'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/app/api/useApi'; // Adjust path as needed
import { useSession } from 'next-auth/react';
import PageLayout from '../_components/PageLayout';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const { data: session, status } = useSession();

  const { fetchData, error } = useApi();

  useEffect(() => {
    if (!user && session?.user.token) {
      const getUserData = async () => {
        const data = await fetchData(
          'http://localhost:8080/admin-dashboard',
          session?.user.token
        );
        if (data) {
          setUser(data.user);
        }
      };

      getUserData();
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
    </PageLayout>
  );
}
