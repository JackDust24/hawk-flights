'use client';

import { useFormState } from 'react-dom';
import { searchFlight } from '../../actions/flights';

const initialState = {
  message: '',
};

export default function Flights() {
  const [state, action] = useFormState(searchFlight, initialState);

  return (
    <>
      <form action={action}>
        <div className='md:w-[700px] bg-[#eaedf0] m-auto border-2 flex flex-col border-slate-100 p-8 space-y-8 shadow-xl'>
          <input type='text' name='origin' placeholder='orign' required />
          <input
            type='text'
            name='destination'
            placeholder='destination'
            required
          />
          <input
            name='startDate'
            placeholder='Start Date (dd/mm/yyyy)'
            required
          />
          <input name='endDate' placeholder='End Date (dd/mm/yyyy)' required />
          <button type='submit'>Search</button>
        </div>
      </form>
      <p aria-live='polite'>{state?.message}</p>
    </>
  );
}
