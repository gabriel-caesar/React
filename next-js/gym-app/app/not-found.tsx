import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex flex-col items-center justify-center  h-screen'>
      <h1 className='text-3xl font-bold text-center'>404 - Page Not Found</h1>
      <p className='text-gray-500 mt-2 text-center'>
        The page you're looking for doesn't exist.
      </p>
      <Link
        id='back-home-button'
        aria-label='back-home-button'
        className='bg-[linear-gradient(45deg,#525252_50%,#737373)] border-1 border-neutral-400 rounded-lg p-2 text-lg hover:cursor-pointer hover:scale-105 active:scale-95 hover:text-red-400 mt-8 transition-all'
        href={'/'}
      >
        Back to Dashboard
      </Link>
    </div>
  );
}