import animation from '@/app/css/skeleton-pulse.module.css';

export default function ChatBubbleSkeleton({ role, width } : { role: string, width: string }) {
  return (
    <div
      aria-label='message-bubble-wrapper-skeleton'
      id='message-bubble-wrapper'
      className={`${role === 'ai' ? 'justify-start' : 'justify-end'} flex items-center w-full my-6 break-normal`}
    >
      <p
        aria-label='message-bubble-skeleton'
        id='message-bubble-skeleton'
        className={`border ${role === 'ai' ? `border-neutral-500 bg-neutral-700 ${animation.shimmer_gray}` : `border-red-300 bg-red-400 ${animation.shimmer_red}`} flex p-2 rounded-md w-${width} h-10 max-w-3/4 break-normal`}
      ></p>
    </div>
  );
}
