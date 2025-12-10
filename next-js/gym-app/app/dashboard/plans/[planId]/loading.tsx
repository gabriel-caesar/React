import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import animations from '../../../css/animations.module.css';

export default function Loading() {
  return (
    <div
      id='loading-page-container'
      className='w-full flex justify-center items-center h-screen'
    >
      <div
        id='loading-state-container'
        className='text-neutral-400 w-full flex flex-col justify-center items-center'
      >
        <AiOutlineLoading3Quarters
          className={`${animations.loading} text-2xl mb-2`}
        />
        <h1
          id='loading-header'
          aria-label='loading-header'
          className='text-center text-2xl'
        >
          Loading...
        </h1>
      </div>
    </div>
  )
}