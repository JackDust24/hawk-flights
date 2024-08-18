import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flight } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function BookingForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='w-full max-w-md mx-auto bg-white p-6 shadow-lg rounded-lg'
    >
      <Label className='text-xl font-semibold'>Passenger Details</Label>
      <div className='flex flex-col my-2 gap-4'>
        <Label htmlFor='passengerName' className='flex flex-col'>
          <span className='py-1'>Passenger Name</span>
          <Input
            type='text'
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border-2 p-2 rounded'
            required
          />
        </Label>
        <Label htmlFor='passengeEmail' className='flex flex-col'>
          <span className='py-1'>Passenger Email</span>
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border-2 p-2 rounded'
            required
          />
        </Label>
      </div>

      <Label className='text-xl font-semibold mb-4'>Payment Details</Label>
      <div className='flex flex-col my-2 gap-4'>
        <Label htmlFor='cardNumber' className='flex flex-col'>
          <span className='py-1'>Card Number</span>
          <Input
            id='cardNumber'
            name='cardNumber'
            type='text'
            placeholder='Card Number'
            maxLength={12}
            className='border-2 p-2 rounded'
            required
          />
        </Label>

        <Label htmlFor='expiryDate' className='flex flex-col'>
          <span className='py-1'>Expiry Date (MM/YYYY)</span>
          <Input
            id='expiryDate'
            name='expiryDate'
            type='text'
            placeholder='MM/YYYY'
            maxLength={7}
            className='border-2 p-2 rounded'
            required
          />
        </Label>

        <Label htmlFor='securityCode' className='flex flex-col'>
          <span className='py-1'>Security Code</span>
          <Input
            id='securityCode'
            name='securityCode'
            type='text'
            placeholder='Security Code'
            maxLength={3}
            className='border-2 p-2 rounded'
            required
          />
        </Label>

        <Label htmlFor='bankName' className='flex flex-col'>
          <span className='py-1'>Bank Name</span>
          <Input
            id='bankName'
            name='bankName'
            type='text'
            placeholder='Bank Name'
            className='border-2 p-2 rounded'
            required
          />
        </Label>

        <Label htmlFor='nameOnAccount' className='flex flex-col'>
          <span className='py-1'>Name on Account</span>
          <Input
            id='nameOnAccount'
            name='nameOnAccount'
            type='text'
            placeholder='Name on Account'
            className='border-2 p-2 rounded'
            required
          />
        </Label>
      </div>
      <Button type='submit' variant='select'>
        Book Now
      </Button>
    </form>
  );
}
