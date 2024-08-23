'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { PageHeader } from '../_components/PageHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signIn, useSession } from 'next-auth/react';
import PageLayout from '../_components/PageLayout';
import z from 'zod';

type Response = {
  error?: {
    email?: string;
    password?: string;
    message?: string;
  } | null;
  success?: boolean;
  message?: string;
};

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

export default function Login() {
  const [response, setResponse] = useState<Response | null>(null);
  const { data: session, status } = useSession();

  if (status === 'loading')
    return <PageLayout title='Loading'>Please wait...</PageLayout>;
  if (session) {
    return (
      <PageLayout title='You are logged in'>
        Access your profile or search for flights
      </PageLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setResponse({
        error: {
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        },
        success: false,
      });
      return;
    }

    const res = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
    });

    if (res?.ok) {
      setResponse({
        error: null,
        success: true,
      });
    }

    if (res?.error) {
      setResponse({
        error: { password: 'Invalid email or password' },
        success: false,
      });
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
            <div className='text-destructive'>{response?.error?.email}</div>
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
            <div className='text-destructive'>{response?.error?.password}</div>
          </Label>
        </div>
        <div className='flex justify-between items-center mt-8 mb-2'>
          <SubmitButton />
        </div>
        {response && (
          <div className='flex items-center mt-8 text-center'>
            <p className='text-red-500'>
              {response?.error && (
                <p>{response.error.message || 'Login failed'}</p>
              )}
              {response?.success && <p>{response.message}</p>}
            </p>
          </div>
        )}
      </form>
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
