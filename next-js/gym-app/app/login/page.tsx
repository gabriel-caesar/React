import { Suspense } from 'react';
import LoginForm from '../ui/login-form';

export default function Page() {
  return (
    <div className='h-screen flex justify-center items-center'>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
