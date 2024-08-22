import React from 'react';

type PageLayoutProps = {
  children?: React.ReactNode;
  title: string;
};

function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className='flex min-h-screen h-full bg-gray-100 items-center justify-center p-24'>
      <div className='flex flex-col items-center justify-center space-y-8 text-xl text-[#1435db] text-center'>
        <h1 className='text-4xl font-bold'>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default PageLayout;
