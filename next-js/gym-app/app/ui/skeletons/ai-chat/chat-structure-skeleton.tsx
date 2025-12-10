import styles from '@/app/css/dashboard.module.css';
import ChatBubbleSkeleton from './chat-bubble-skeleton';
import InputSkeleton from './input-skeleton';
import { Orbitron } from 'next/font/google';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function ChatStructureSkeleton() {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-full overflow-hidden relative'>
      <div
        className='w-full bg-[linear-gradient(45deg,#262626_50%,#353535)] border-b-1 
        border-neutral-600 flex justify-end items-center absolute top-0 left-0 z-2 py-1 px-3'
      >
        <h1
          style={{ letterSpacing: '0.1rem' }}
          className={`
            ${orbitron.className}
            text-lg lg:text-2xl
            max-[1024px]:top-2.5 p-1 rounded-md
          `}
        >
          <p>
            Loading
          </p>
        </h1>
      </div>
      <div className={`
        p-10 ${styles.scrollbar_chat}
        pb-30 pt-20 z-1 mb-4 relative
        w-full lg:w-[900px] lg:px-10 px-2 overflow-hidden
      `}>
        <ChatBubbleSkeleton role='user' width='full' />
        <ChatBubbleSkeleton role='ai' width='full' />
        <ChatBubbleSkeleton role='user' width='full' />
        <ChatBubbleSkeleton role='ai' width='full' />
        <ChatBubbleSkeleton role='user' width='full' />
        <ChatBubbleSkeleton role='ai' width='full' />
      </div>
      <div className='fixed w-13/14 lg:w-[865px] bottom-2 left-1/2 -translate-x-1/2 z-2'>
        <InputSkeleton />
      </div>
    </div>
  )
}