import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { DatePicker } from '../../_components/DatePicker';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type FlightsFormProps = {
  onSubmit: (payload: FormData) => void;
  error: any; //TODO: Set this up properly
};
const initialState = {
  message: '',
};

export default function FlightsForm({ onSubmit, error }: FlightsFormProps) {
  const [flightDate, setFlightDate] = useState<Date | null>(null);
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  console.log('Return date:', returnDate);

  useEffect(() => {
    if (flightDate && returnDate && flightDate > returnDate) {
      setReturnDate(flightDate);
    }
  }, [flightDate, returnDate]);

  return (
    <div className='mx-auto p-4 w-full'>
      <form
        action={onSubmit}
        className='md:w-3/4 m-auto border-8 border-[#90e0ef] p-8 space-y-4 shadow-xl bg-white'
      >
        <div className='md:grid grid-cols-1 hidden md:grid-cols-4 gap-4'>
          <Label htmlFor='text' className='block text-gray-700 font-bold'>
            Origin
          </Label>
          <Label htmlFor='text' className='block text-gray-700 font-bold'>
            Destination
          </Label>
          <Label htmlFor='text' className='block text-gray-700 font-bold'>
            Outbound Flight
          </Label>
          <Label htmlFor='text' className='block text-gray-700 font-bold'>
            Inbound Flight
          </Label>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          <Input
            type='text'
            id='origin'
            name='origin'
            placeholder='Origin'
            required
            className='border-2'
          />
          <Input
            type='text'
            id='destination'
            name='destination'
            placeholder='Destination'
            required
            className='border-2'
          />
          <DatePicker
            className='border-2 z-20'
            value={flightDate || undefined}
            onChange={(date) => setFlightDate(date || undefined)}
          />
          {/* Hidden input to store return date for form submission */}
          <input
            type='hidden'
            name='flightDate'
            value={flightDate ? format(flightDate, 'yyyy-MM-dd') : ''}
          />
          <DatePicker
            className='border-2 z-20'
            value={returnDate || undefined}
            onChange={(date) => setReturnDate(date || undefined)}
          />
          {/* Hidden input to store return date for form submission */}
          <input
            type='hidden'
            name='returnDate'
            value={returnDate ? format(returnDate, 'yyyy-MM-dd') : ''}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='text-destructive'>{error?.origin}</div>
          <div className='text-destructive'>{error?.destination}</div>
          <div className='text-destructive'>{error?.flightDate}</div>
          <div className='text-destructive'>{error?.returnDate}</div>
        </div>
        <div className='flex justify-between items-center mb-4'>
          <div className='flex items-center text-3xl'>
            Please enter flight details
          </div>
          <div className='flex justify-end'>
            <Button type='submit' variant='select'>
              Search
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
