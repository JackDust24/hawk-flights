import React from 'react';
import { ToastAction } from './ui/toast';

export default function ToastActionButton() {
  return (
    <ToastAction className='font-bold border-2 p-2 border-white' altText='Ok'>
      OK!
    </ToastAction>
  );
}
