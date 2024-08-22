'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { PageHeader } from '../_components/PageHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import PageLayout from '../_components/PageLayout';

const initialState = {
  message: '',
  success: false,
};

type Response = {
  error?: {
    emailOrPassword?: string;
    message?: string;
  };
  success?: boolean;
  message?: string;
};

//TODO: Sort out error responses
export default function Login() {
  const [error, setError] = useState<Response | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter(); //TODO: Work out routing

  if (status === 'loading') return <p>Loading...</p>;
  if (session)
    return (
      <PageLayout title='You are logged in'>
        Access your profile or search for flights
      </PageLayout>
    );

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      setError({ error: { emailOrPassword: 'Credentials may be invalid' } });
      return;
    }

    if (!password || password.length < 8) {
      setError({ error: { emailOrPassword: 'Credentials may be invalid' } });
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      console.log('*** Login Ok > ');
    }
    if (res?.error) {
      setError({ error: { message: 'Invalid email or password' } });
    } else {
      setError(null);
    }
  };

  return (
    <div className='mx-auto p-4 w-full'>
      <PageHeader>Login</PageHeader>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg'
      >
        <Label className='text-xl font-semibold'>Please Login</Label>
        <div className='flex flex-col my-2 gap-4'>
          <Label htmlFor='userEmail' className='flex flex-col'>
            <span className='py-1'>Email</span>
            <Input
              id='email'
              type='email'
              placeholder='Email'
              name='email'
              className='border-2 p-2 rounded'
              required
            />
            <div className='text-destructive'>
              {error?.error?.emailOrPassword}
            </div>
          </Label>
          <Label htmlFor='userEmail' className='flex flex-col'>
            <span className='py-1'>Password</span>
            <Input
              id='password'
              type='password'
              placeholder='Password'
              name='password'
              className='border-2 p-2 rounded'
              required
            />
            <div className='text-destructive'>
              {error?.error?.emailOrPassword}
            </div>
          </Label>
        </div>
        <div className='flex justify-between items-center mt-8 mb-2'>
          <SubmitButton />
        </div>
      </form>
      {response && (
        <p className='text-red-500'>
          {response.message ?? error?.error?.message}
        </p>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' variant='select' disabled={pending}>
      {pending ? 'Logging In...' : 'Login'}
    </Button>
  );
}
