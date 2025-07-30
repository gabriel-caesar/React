'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useActionState, useState } from 'react';
import { authenticate } from '../../auth';
import { useSearchParams } from 'next/navigation';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <form
      action={formAction}
      className='my-10 w-[462px] flex flex-col justify-center items-center rounded-md bg-neutral-800 p-6 border-red-400 border-1 shadow-st'
    >
      <h1 className='font-light text-2xl text-center mb-10 border-b-1 border-red-400'>
        Login to your account
      </h1>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='flex flex-col justify-center relative w-full mb-5'
        >
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            placeholder='Enter your email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-white rounded-sm w-full p-2 pr-12 text-xl text-neutral-800 input-focus transition-all duration-300'
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col justify-center relative w-full '
        >
          <label htmlFor='pass'>Password</label>
          <input
            type='password'
            id='pass'
            placeholder='Enter your password'
            name='pass'
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className='bg-white rounded-sm w-full p-2 pr-12 text-xl text-neutral-800 input-focus transition-all duration-300'
          />
        </motion.div>
      </AnimatePresence>

      <div
        className='flex h-8 items-end space-x-1 mb-10'
        aria-live='polite'
        aria-atomic='true'
      >
        {errorMessage && <p data-testid="errorElement" className='text-lg text-red-500'>* {errorMessage}</p>}
      </div>

      <input type="hidden" name="redirectTo" value={callbackUrl} />

      <motion.button
        className='text-center rounded-md text-2xl w-50 p-2 bg-white text-black hover:cursor-pointer'
        id='login-button'
        whileHover={{
          scale: 1.1,
          color: '#E63946',
          boxShadow: `0 0 20px 2px #E63946`,
        }}
        whileTap={{ scale: 1.05 }}
        aria-disabled={isPending}
      >
        Log In
      </motion.button>

    </form>
  );
}
