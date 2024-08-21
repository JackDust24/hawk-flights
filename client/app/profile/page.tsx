'use client';
import { useEffect, useState } from 'react';
import { useApi } from '@/app/api/useApi'; // Adjust path as needed
import { useSession } from 'next-auth/react';

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
    <div className='flex min-h-screen h-full bg-gray-100 items-center justify-center p-24'>
      <div className='flex flex-col items-center justify-center space-y-8'>
        <h1>Profile</h1>
        {error && <p className='text-red-500'>{error} Please sign in</p>}
        {user && (
          <div>
            <p>Welcome, {user.username}</p>
            <p>You are authorised to view this page</p>
          </div>
        )}
      </div>
    </div>
  );
}
