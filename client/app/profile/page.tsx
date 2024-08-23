'use client';
import { useEffect, useState } from 'react';
import { useApi } from '@/app/api/useApi'; // Adjust path as needed
import { useSession } from 'next-auth/react';
import PageLayout from '../_components/PageLayout';

export default function Profile() {
  const { data: session, status } = useSession();

  const [user, setUser] = useState<any>(null);
  const { fetchData, error } = useApi();
  const [isNeedToLogin, setIsNeedToLogin] = useState(false);

  useEffect(() => {
    if (user) return;
    if (session?.user.token) {
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
    } else {
      setIsNeedToLogin(true);
      const timer = setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);

      return () => clearTimeout(timer);
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
        <p className='text-red-500'>You need to login to access this page</p>
      )}
    </PageLayout>
  );
}
