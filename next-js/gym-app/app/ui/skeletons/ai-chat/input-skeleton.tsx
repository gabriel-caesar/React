import animation from '@/app/css/skeleton-pulse.module.css';

export default function InputSkeleton() {
  return (
    <div
      aria-label='input-skeleton'
      className={`
            max-[1024px]:w-11/12 max-[1024px]:h-[117.5px]
            flex items-center justify-center mb-2 w-3/4 h-[88px] rounded-lg bg-neutral-600 relative 
            ${animation.shimmer_gray}
          `}
    >
      <button
        aria-label='send-message-button-skeleton'
        className={`
          ${animation.shimmer_black} 
          absolute top-3.5 right-3 rounded-full w-15 h-15 flex items-center justify-center bg-neutral-900`}
      >
      </button>
    </div>
  );
}
