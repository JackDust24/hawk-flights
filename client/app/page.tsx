import Image from 'next/image';
import Flights from './flights/page';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className='flex min-h-screen h-full bg-gray-100 items-center justify-center p-24'>
      <div className='flex flex-col items-center justify-center space-y-8'>
        <h1 className='text-6xl font-bold text-[#72daec]'>Welcome to</h1>
        <h2 className='text-6xl font-bold text-[#72daec]'>
          Hawk Flight Booker
        </h2>
        <Link
          href='/flights'
          className='px-12 py-4 shadow-2xl rounded-xl bg-cyan-500 text-white text-3xl'
        >
          <span>Enter</span>
        </Link>
      </div>
    </main>
  );
}
