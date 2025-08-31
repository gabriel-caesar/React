import styles from '@/app/css/dashboard.module.css';
import ChatBubbleSkeleton from './chat-bubble-skeleton';
import InputSkeleton from './input-skeleton';

export default function ChatStructureSkeleton() {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-full overflow-hidden'>
      <h1
        aria-label='conversation-title'
        id='conversation-title'
        className='
        min-[1024px]:border-b-2 min-[1024px]:border-white
        max-[1024px]:text-lg max-[1024px]:top-2.5 
        absolute right-3 top-3 text-2xl p-1 rounded-md
        '
      >
        Loading...
      </h1>
      <div className={`
              [@media(max-height:300px)]:border-t-0
              max-[1024px]:h-screen max-[1024px]:w-full max-[1024px]:border-t-1 max-[1024px]:border-neutral-400
              w-4/5 h-3/4 p-10 mt-[50px] overflow-y-auto overflow-x-hidden ${styles.scrollbar_chat}
            `}>
          <ChatBubbleSkeleton role='user' width='full' />
          <ChatBubbleSkeleton role='ai' width='full' />
          <ChatBubbleSkeleton role='user' width='full' />
          <ChatBubbleSkeleton role='ai' width='full' />
          <ChatBubbleSkeleton role='user' width='full' />
          <ChatBubbleSkeleton role='ai' width='full' />
      </div>
      <InputSkeleton />
    </div>
  )
}