import Link from 'next/link';
import PageLayout from './_components/PageLayout';

export default function NotFound() {
  return (
    <PageLayout title='Not Found'>
      <p>Could not find requested resource</p>
      <Link href='/' className='underline font-bold'>
        Return Home
      </Link>
    </PageLayout>
  );
}
