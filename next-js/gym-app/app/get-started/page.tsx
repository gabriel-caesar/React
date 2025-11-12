import GetStartedForm from '../ui/getstarted-form';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Get Started',
};

export default function GetStarted() {
  return (
    <div className='flex justify-center items-start w-full'>
      <GetStartedForm />
    </div>
  )
}