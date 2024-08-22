'use client';
import { useEffect, useState } from 'react';
import { useApi } from '@/app/api/useApi'; // Adjust path as needed
import { useSession } from 'next-auth/react';
import PageLayout from '../_components/PageLayout';

export default function Profile() {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<any>(null);
  const { fetchData, error } = useApi();

  useEffect(() => {
    if (!user && session?.user.token) {
      const getProfileData = async () => {
        const data = await fetchData(
          'http://localhost:8080/profile',
          session?.user.token
        );
        if (data) {
          setUser(data.user);
        }
      };

      getProfileData();
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
    </PageLayout>
  );
}
