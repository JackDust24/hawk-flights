import Image from 'next/image';
import Flights from './flights/page';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className='flex min-h-screen items-center justify-between p-24'>
      <Link href='/flights' className='px-4 bg-emerald-400 text-white text-3xl'>
        <span>Enter</span>
      </Link>
    </main>
  );
}
