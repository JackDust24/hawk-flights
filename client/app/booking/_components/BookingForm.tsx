import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flight } from '@/app/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createPaymentIntentAndBooking } from '@/actions/bookings';
import { z } from 'zod';
import { useFlightStore } from '@/store/flightStore';
import { useBookingStore } from '@/store/bookingStore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import ToastActionButton from '@/app/_components/ToastActionButton';

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

type ErrorTypes = {
  fullname?: string[] | undefined;
  email?: string[] | undefined;
  cardNumber?: string[] | undefined;
  expiryDate?: string[] | undefined;
  securityCode?: string[] | undefined;
  bankName?: string[] | undefined;
  nameOnAccount?: string[] | undefined;
};

//TODO: Refactoring
export default function BookingForm({ totalPrice }: { totalPrice: string }) {
  const { toast } = useToast();
  const router = useRouter();

  const [error, setError] = useState<ErrorTypes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedInboundFlight, selectedOutboundFlight } = useFlightStore();
  const { addBooking } = useBookingStore();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const form = event.currentTarget;
    const formData: Record<string, string> = {};

    Array.from(form.elements).forEach((element) => {
      if (
        element instanceof HTMLInputElement ||
        element instanceof HTMLSelectElement ||
        element instanceof HTMLTextAreaElement
      ) {
        formData[element.name] = element.value as string;
      }
    });

    const formResults = paymentSchema.safeParse(formData);

    if (formResults.success === false) {
      toast({
        variant: 'destructive',
        title: 'There were errors in the form.',
        description: 'Please check you filled the form correctly.',
        action: <ToastActionButton />,
      });
      setError(formResults.error.formErrors.fieldErrors);
      setIsLoading(false);

      return formResults.error.formErrors.fieldErrors;
    }

    const validatedPaymentData = formResults.data;

    if (!selectedInboundFlight) {
      toast({
        variant: 'destructive',
        title: 'No Inbound flight selected.',
        description: 'Please refresh the page or select flight again.',
        action: <ToastActionButton />,
      });
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

      if (response.status === 'success' && response.booking) {
        console.log(response.booking);
        addBooking(response.booking);
        const bookingId = response.booking.bookingId;
        router.refresh();
        toast({
          title: 'Your booking was a success.',
          description: `Confirmation of booking - ${bookingId} .`,
        });
        router.push(
          '/confirmation' +
            '?' +
            createBookingParams('bookingId', `${bookingId}`)
        );
      } else {
        toast({
          variant: 'destructive',
          title: 'Booking failed.',
          description:
            'There was a problem making your booking. Please contact support',
          action: <ToastActionButton />,
        });
        setIsLoading(false);
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'An error occurred during payment.',
        description: 'Please recheck that you entered the correct details.',
        action: <ToastActionButton />,
      });
      setIsLoading(false);
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
            placeholder='full name'
            name='fullname'
            className='border-2 p-2 rounded'
            required
          />
          <div className='text-destructive'>{error?.fullname}</div>
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
          <div className='text-destructive'>{error?.email}</div>
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
          <div className='text-destructive'>{error?.cardNumber}</div>
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
          <div className='text-destructive'>{error?.expiryDate}</div>
        </Label>

        <Label htmlFor='securityCode' className='flex flex-col'>
          <span className='py-1'>Security Code</span>
          <Input
            id='securityCode'
            name='securityCode'
            type='password'
            placeholder='Security Code'
            maxLength={3}
            className='border-2 p-2 rounded'
            required
          />
          <div className='text-destructive'>{error?.securityCode}</div>
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
          <div className='text-destructive'>{error?.bankName}</div>
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
          <div className='text-destructive'>{error?.nameOnAccount}</div>
        </Label>
      </div>
      <div className='flex justify-between items-center mt-8 mb-2'>
        <SubmitButton isPending={isLoading} />
      </div>
    </form>
  );
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type='submit' variant='select' disabled={isPending}>
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

const createBookingParams = (name: string, value: string) => {
  const params = new URLSearchParams();
  params.set(name, value);

  return params.toString();
};
