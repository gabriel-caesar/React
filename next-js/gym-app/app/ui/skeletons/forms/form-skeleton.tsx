import animation from '@/app/css/skeleton-pulse.module.css';

export default function FormSkeleton({ height }: { height: string }) {

  return (
    <div
      className={`
        ${animation.shimmer_gray_block}
        w-[462px] ${height} max-[500px]:w-11/12 flex flex-col justify-center items-center rounded-md bg-neutral-800 p-6 border-red-400 border-1
      `}
    ></div>
  )
}