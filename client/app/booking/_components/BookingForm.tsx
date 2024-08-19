import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flight } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createPaymentIntentAndBooking } from '@/actions/bookings';
import { z } from 'zod';
import { useFlightStore } from '@/store/flightStore';
import { useBookingStore } from '@/store/bookingStore';
import { useRouter } from 'next/navigation';

const paymentSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  cardNumber: z.string().length(16, 'Card number must be 16 digits'),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, 'Invalid expiry date (MM/YYYY)'),
  securityCode: z.string().length(3, 'Security code must be 3 digits'),
  bankName: z.string().min(1, 'Bank name is required'),
  nameOnAccount: z.string().min(1, 'Name on account is required'),
});

export default function BookingForm({ totalPrice }: { totalPrice: string }) {
  const [error, setError] = useState(''); //TODO: Set errors
  const [isLoading, setIsLoading] = useState(false);
  const { selectedInboundFlight, selectedOutboundFlight } = useFlightStore();
  const { addBooking } = useBookingStore();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const form2 = event.currentTarget;
    const formData2: Record<string, string> = {};

    // Iterate over the form elements
    Array.from(form2.elements).forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) {
        formData2[element.name] = element.value as string;
      }
    });

    const formResults = paymentSchema.safeParse(formData2);

    if (formResults.success === false) {
      return formResults.error.formErrors.fieldErrors;
    }

    const validatedPaymentData = formResults.data;

    if (!selectedInboundFlight) {
      setError('No Inbound flight selected');
      setIsLoading(false);
      return;
    }

    const flightDetails = getFlightDetails(
      selectedInboundFlight,
      selectedOutboundFlight ?? undefined
    );

    try {
      const response = await createPaymentIntentAndBooking({
        paymentData: validatedPaymentData,
        flightData: flightDetails,
        totalPrice,
      });

      if (Object.hasOwn(response, 'bookingId')) {
        addBooking(response);
        router.push('/confirmation');
      } else {
        setError('Payment failed.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred during payment.');
    } finally {
      setIsLoading(false);
    }
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
            id='fullname'
            type='text'
            placeholder='Name'
            name='fullname'
            className='border-2 p-2 rounded'
            required
          />
        </Label>
        <Label htmlFor='passengeEmail' className='flex flex-col'>
          <span className='py-1'>Passenger Email</span>
          <Input
            id='email'
            type='email'
            placeholder='Email'
            name='email'
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
            type='number'
            placeholder='Card Number'
            maxLength={16}
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
            type='number'
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
      <SubmitButton isPending={isLoading} />
    </form>
  );
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type='submit' variant='select' disabled={false}>
      {isPending ? 'Booking...' : 'Book Now'}
    </Button>
  );
}

function getFlightDetails(flightInound: Flight, flightOutbound?: Flight) {
  const flightDetails: Flight[] = [];
  flightDetails.push(flightInound);
  if (flightOutbound) {
    flightDetails.push(flightOutbound);
  }
  return flightDetails;
}
