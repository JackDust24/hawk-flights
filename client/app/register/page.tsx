'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { registerUser } from '@/actions/auth';
import { PageHeader } from '../_components/PageHeader';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const initialState = {
  success: false,
  message: '',
};

export default function Register() {
  const [response, action] = useFormState(registerUser, initialState);

  useEffect(() => {
    if (response?.success) {
      setTimeout(() => {
        window.location.href = '/signin';
      }, 1000);
    }
  }, [response]);

  return (
    <div className='mx-auto p-4 w-full'>
      <PageHeader>Register</PageHeader>
      <form
        action={action}
        className='w-full max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg'
      >
        <Label className='text-xl font-semibold'>Add Credentials</Label>
        <div className='flex flex-col my-2 gap-4'>
          <Label htmlFor='userName' className='flex flex-col'>
            <span className='py-1'>Username</span>
            <Input
              id='username'
              type='text'
              placeholder='Username'
              name='username'
              className='border-2 p-2 rounded'
              required
            />
            <div className='text-destructive'>
              {response?.fieldErrors?.username}
            </div>
          </Label>
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
              {response?.fieldErrors?.email}
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
              {response?.fieldErrors?.password}
            </div>
          </Label>
        </div>
        <div className='flex justify-between items-center mt-8 mb-2'>
          <SubmitButton disableButton={!!response?.success} />
        </div>
        {response && <p className='text-red-500'>{response?.message}</p>}
      </form>
    </div>
  );
}

function SubmitButton({ disableButton }: { disableButton: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type='submit' variant='select' disabled={pending || disableButton}>
      {pending ? 'Registering...' : 'Register'}
    </Button>
  );
}
