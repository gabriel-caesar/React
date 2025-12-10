import animation from '@/app/css/skeleton-pulse.module.css';

export default function InputSkeleton() {
  return (
    <div
      aria-label='input-skeleton'
      className={`
            border border-neutral-500
            flex items-center justify-center mb-2 w-full h-[88px] rounded-lg bg-neutral-600 relative 
            ${animation.shimmer_gray}
          `}
    >
      <button
        aria-label='send-message-button-skeleton'
        className={`
          ${animation.shimmer_black} 
          absolute top-1/2 -translate-y-1/2 right-3 rounded-full w-11 h-11 border border-neutral-500 flex items-center justify-center bg-neutral-900`}
      >
      </button>

      <button
        aria-label='send-message-button-skeleton'
        className={`
          ${animation.shimmer_black} 
          absolute top-1/2 -translate-y-1/2 left-3 rounded-full w-11 h-11 border border-neutral-500 flex items-center justify-center`}
      >
      </button>
    </div>
  );
}
