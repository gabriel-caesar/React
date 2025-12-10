'use client';
 
import { useEffect } from 'react';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <main className="flex h-screen flex-col items-center justify-center text-center px-2">
      <h2 className="text-center text-3xl">Something went wrong!</h2>
      <button
        className='bg-[linear-gradient(45deg,#525252_50%,#737373)] border-1 border-neutral-400 hover:scale-105 active:scale-95 hover:text-red-400 rounded-lg p-2 text-lg hover:cursor-pointer mt-8 transition-all'
        onClick={
          // Attempt to recover by trying to re-render the invoices route
          () => reset()
        }
      >
        Try again
      </button>
      <p className='text-neutral-500 mt-10'>
        Please, contact the developer right away and tell us what's going wrong
      </p>
      <p className='text-neutral-500 mt-2'>
        Email: <span className='text-blue-400'>gabriel.mdonno@hotmail.com</span>
      </p>
    </main>
  );
}