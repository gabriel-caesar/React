import { Suspense } from 'react';
import LoginForm from '../ui/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function Page() {
  return (
    <div className='h-screen flex justify-center items-center w-full'>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
