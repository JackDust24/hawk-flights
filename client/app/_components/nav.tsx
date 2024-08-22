'use client';
import { format } from 'url';
import { cn } from '@/app/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps, ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';

export function Nav({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <nav
      className={cn(
        'bg-[#90e0ef] text-primary-foreground flex justify-center px-1 md:px-4',
        className
      )}
    >
      {children}
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, 'classname'>) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      className={cn(
        'p-4 hover:text-[#252cee] text-black md:text-2xl focus-visible:text-[#252cee]',
        pathname === props.href && 'text-[#252cee]'
      )}
    />
  );
}

export function LoginStatus() {
  const { data: session } = useSession();

  return (
    <div className='absolute right-10 top-4 text-[#252cee] text-lg'>
      {session ? (
        <>
          <p className='hidden md:inline-block'>{session.user?.email}</p>
          <Link
            className='text-center text-white hover:underline'
            href='/'
            onClick={() => signOut()}
          >
            {' '}
            <strong>Sign Out</strong>
          </Link>
        </>
      ) : (
        <>
          <NavLink href='/signin'>Sign In</NavLink>
          <NavLink href='/register'>Register</NavLink>
        </>
      )}
    </div>
  );
}
