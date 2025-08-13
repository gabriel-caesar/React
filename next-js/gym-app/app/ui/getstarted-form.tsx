'use client';

import { Lock, LockKeyhole, Mail, UserCog, UserLock } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { signup } from '../actions/auth';
import { useActionState, useState } from 'react';
import '../css/globals.css';

export default function GetStartedForm() {
  // states to persist data if validation is refused
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // state === error/feedback state
  // action === signup
  // pending === action being loaded after submitted
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form
      className='my-10 w-[462px] max-[500px]:w-11/12 flex flex-col justify-center items-center rounded-md bg-neutral-800 p-6 border-red-400 border-1 shadow-st'
      action={action}
    >
      <h1 className='font-light text-2xl text-center mb-10 border-b-1 border-red-400'>
        A new self, reborn
      </h1>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col justify-center relative w-full mb-5'
        >
          <label className='font-light' htmlFor='firstName'>
            First name
          </label>

          <input
            aria-label='first-name'
            className='bg-white rounded-sm w-full p-2 pr-12 text-xl text-neutral-800 input-focus transition-all duration-300'
            id='firstName'
            name='firstName'
            placeholder='Enter your first name'
            type='text'
            value={fName}
            onChange={(e) => setFName(e.target.value)}
          />

          <UserCog
            className='absolute right-2 top-7 text-neutral-600'
            size={32}
            strokeWidth={1}
          />
          {state?.errors?.firstName && (
            <p className='text-red-500' data-testid='first-name-error'>* {state?.errors?.firstName}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className='flex flex-col justify-center w-full relative mb-5'
        >
          <label className='font-light' htmlFor='lastName'>
            Last name
          </label>

          <input
          aria-label='last-name'
            className='bg-white rounded-sm w-full p-2 pr-12 text-xl text-neutral-800 input-focus transition-all duration-300'
            id='lastName'
            name='lastName'
            placeholder='Enter your last name'
            type='text'
            value={lName}
            onChange={(e) => setLName(e.target.value)}
          />

          <UserLock
            className='absolute right-2 top-7 text-neutral-600'
            size={32}
            strokeWidth={1}
          />
          {state?.errors?.lastName && (
            <p className='text-red-500' data-testid='last-name-error'>* {state?.errors?.lastName}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className='flex flex-col justify-center w-full relative mb-5'
        >
          <label htmlFor='email' className='font-light'>
            Email address
          </label>

          <input
            aria-label='email-address'
            type='email'
            id='email'
            name='email'
            placeholder='Enter your email'
            className='bg-white rounded-sm w-full p-2 pr-12 text-xl text-neutral-800 input-focus transition-all duration-300'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Mail
            className='absolute right-2 top-7.5 text-neutral-600'
            size={32}
            strokeWidth={1}
          />

          {state?.errors?.email && (
            <p className='text-red-500' data-testid='email-error'>* {state?.errors?.email}</p>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className='flex flex-col justify-center w-full relative mb-5'
        >
          <label htmlFor='pass' className='font-light'>
            Password
          </label>

          <input
            aria-label='password'
            type='password'
            id='pass'
            name='pass'
            placeholder='Enter your password'
            className='bg-white rounded-sm w-full p-2 pr-12 text-xl text-neutral-800 input-focus transition-all duration-300'
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />

          <Lock
            className='absolute right-2 top-7.5 text-neutral-600'
            size={32}
            strokeWidth={1}
          />
          {state?.errors?.password && (
            <div>
              {state?.errors?.password.map((x) => (
                <p key={x} className='text-red-500' data-testid='pass-error'>
                  * {x}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className='flex flex-col justify-center w-full relative mb-10'
        >
          <label htmlFor='confirmPass' className='font-light'>
            Confirm password
          </label>

          <input
            aria-label='confirm-password'
            type='password'
            id='confirmPass'
            name='confirmPass'
            placeholder='Confirm your password'
            className='bg-white rounded-sm w-full p-2 pr-12 text-xl text-neutral-800 input-focus transition-all duration-300'
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />

          <LockKeyhole
            className='absolute right-2 top-7.5 text-neutral-600'
            size={32}
            strokeWidth={1}
          />
          {state?.errors?.confirmPassword && (
            <div>
              {state?.errors?.confirmPassword.map((x) => (
                <p key={x} className='text-red-500' data-testid='confirm-pass-error'>
                  * {x}
                </p>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.button
        className='text-center rounded-md text-2xl w-50 p-2 bg-white text-black hover:cursor-pointer'
        id='next-btn'
        whileHover={{
          scale: 1.1,
          color: '#E63946',
          boxShadow: `0 0 20px 2px #E63946`,
        }}
        whileTap={{ scale: 1.05 }}
        disabled={pending}
        data-testid='next-btn'
      >
        Register
      </motion.button>
    </form>
  );
}
