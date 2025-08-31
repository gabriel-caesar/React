import GetStartedForm from '../ui/getstarted-form';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Get Started',
};

export default function GetStarted() {
  return (
    <div className='h-screen flex justify-center items-center w-full'>
      <GetStartedForm />
    </div>
  )
}