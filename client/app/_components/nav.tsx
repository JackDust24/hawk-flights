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
        'bg-[#90e0ef] text-primary-foreground flex px-1 md:px-4',
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
        'px-1 md:px-4 py-4 hover:text-[#252cee] text-black md:text-md text-sm focus-visible:text-[#252cee]',
        pathname === props.href && 'text-[#252cee]'
      )}
    />
  );
}

export function LoginStatus() {
  const { data: session } = useSession();

  return (
    <div className='absolute right-10 top-4 text-[#252cee]'>
      {session ? (
        <div className='flex justify-between gap-2'>
          <p className='hidden md:inline-block text-black'>
            {session.user?.email}
          </p>
          <Link
            className='text-center hover:underline'
            href='/'
            onClick={() => signOut()}
          >
            <strong>Sign Out</strong>
          </Link>
        </div>
      ) : (
        <>
          <NavLink href='/signin'>Sign In</NavLink>
          <NavLink href='/register'>Register</NavLink>
        </>
      )}
    </div>
  );
}
