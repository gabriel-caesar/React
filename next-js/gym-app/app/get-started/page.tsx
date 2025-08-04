import GetStartedForm from '../ui/getstarted-form';
import { Suspense } from 'react';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Get Started',
};

export default function GetStarted() {
  return (
    <>
      <Suspense>
        <GetStartedForm />
      </Suspense>
    </>
  )
}