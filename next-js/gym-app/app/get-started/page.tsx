import { Metadata } from 'next';
import GetStartedForm from '../ui/getstarted-form';
import { Suspense } from 'react';
 
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