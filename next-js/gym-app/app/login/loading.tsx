import FormSkeleton from '../ui/skeletons/forms/form-skeleton';

export default function Loading() {
  return (
    <div className='h-screen flex justify-center items-center w-full'>
      <FormSkeleton height='h-[398px]' />
    </div>
  )
}