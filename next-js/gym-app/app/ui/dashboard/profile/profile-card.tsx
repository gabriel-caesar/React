'use client';

import { User } from '@/app/lib/definitions';
import { AnimatePresence, motion } from 'framer-motion';
import { MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { Orbitron } from 'next/font/google';
import { useState } from 'react';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function ProfileCard({ user }: { user: User | undefined }) {
  // flag to edit the profile data
  const [editProfile, setEditProfile] = useState<boolean>(false);

  // input field hook states
  const [firstName, setFirstName] = useState<string>(
    user ? user?.firstname : ''
  );
  const [lastName, setLastName] = useState<string>(user ? user?.lastname : '');

  return (
    <div
      id='profile-card-container'
      className='
        bg-[linear-gradient(45deg,#525252_50%,#737373)] md:w-1/2 xl:w-1/4
        rounded-lg p-2 border-1 border-neutral-500 w-full flex flex-col items-center justify-start
      '
    >
      <div className='flex w-full items-center justify-between px-2'>
        <h1
          id='profile-header'
          aria-label='profile-header'
          className={`${orbitron.className} text-xl text-center`}
          style={{ letterSpacing: '0.2rem' }}
        >
          Your profile
        </h1>

        <button
          onClick={() => setEditProfile(!editProfile)}
          id='edit-profile-button'
          aria-label='edit-profile-button'
          className={`
            ${editProfile ? 'bg-red-400 hover:text-black' : 'bg-neutral-800 hover:text-red-400'} hover:cursor-pointer
            rounded-md text-xl p-2 mt-2 hover:scale-110 active:brightness-60 transition-all
          `}
        >
          {editProfile ? <IoClose /> : <MdEdit />}
        </button>
      </div>

      <AnimatePresence>
        <motion.div
          id='avatar-container'
          className='border-1 border-neutral-400 rounded-full overflow-hidden w-2/6 mt-4 shadow-lg'
        >
          <img 
            src='/standard_avatar_icon.png' 
            alt='avatar-icon' 
            className='object-cover w-full'
          />
        </motion.div>
        <div 
          key={'picture-input-key'}
          id="change-picture-wrapper"
          className={`
            ${editProfile ? 'my-3 opacity-100' : 'opacity-0'} transition-all duration-300 bg-neutral-800
            border-1 border-neutral-400 rounded-md flex items-center justify-between w-full shadow-md
          `}
        >
          <button
            id='choose-file-button'
            aria-label='choose-file-button'
            className='
              hover:cursor-pointer hover:brightness-60 active:brightness-50 
              py-1 px-3 transition-all border-r-1 border-neutral-400 w-full
            '
          >
            Choose file
          </button>
          <div
            id='file-names-container'
            aria-label='file-names-container'
            className='w-full py-1 px-3 text-center'
          >
            No file chosen
          </div>
        </div>
      </AnimatePresence>

      <div id='section-wrapper' className='flex flex-col w-full justify-start'>
        <AnimatePresence>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            id='first-name-section'
            className='flex flex-col'
          >
            <label
              htmlFor={editProfile ? 'edit-user-first-name' : 'user-first-name'}
              className='text-xl text-red-400'
            >
              First name
            </label>
            {!editProfile ? (
              <p
                id='user-first-name'
                aria-label='user-first-name'
                className='border-1 border-neutral-400 rounded-md w-full p-1 shadow-md'
              >
                {user?.firstname}
              </p>
            ) : (
              <AnimatePresence>
                <motion.input
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  value={firstName}
                  onChange={(e) => {
                    if (e.target.value.length <= 30) setFirstName(e.target.value);
                  }}
                  placeholder='Your first name...'
                  className='focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800'
                  id='edit-user-first-name'
                  aria-label='edit-user-first-name'
                  type='text'
                  autoFocus
                />
              </AnimatePresence>
            )}
          </motion.section>
        </AnimatePresence>

        <AnimatePresence>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            id='last-name-section'
            className='flex flex-col mt-3'
          >
            <label
              htmlFor={editProfile ? 'edit-user-last-name' : 'user-last-name'}
              className='text-xl text-red-400'
            >
              Last name
            </label>
            {!editProfile ? (
              <p
                id='user-last-name'
                aria-label='user-last-name'
                className='border-1 border-neutral-400 rounded-md w-full p-1 shadow-md'
              >
                {user?.lastname}
              </p>
            ) : (
              <AnimatePresence>
                <motion.input 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  value={lastName}
                  onChange={(e) => {
                    if (e.target.value.length <= 30) setLastName(e.target.value);
                  }}
                  placeholder='Your last name...'
                  className='focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800'
                  id='edit-user-last-name'
                  aria-label='edit-user-last-name'
                  type='text'
                />
              </AnimatePresence>
            )}
          </motion.section>
        </AnimatePresence>

        <AnimatePresence>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            id='email-section'
            className='flex flex-col mt-3'
          >
            <label htmlFor='email-field' className='text-xl text-red-400'>
              Email
            </label>
            <p
              id='email-field'
              aria-label='email-field'
              className='border-1 border-neutral-400 rounded-md w-full p-1 shadow-md'
            >
              {user?.email}
            </p>
          </motion.section>
        </AnimatePresence>

        <AnimatePresence>
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            id='other-details-section'
            className='rounded-md mt-3 bg-neutral-800 p-2 border-1 border-neutral-400 shadow-md'
          >
            <div id="plans-container">
              <label htmlFor='plans-field' className='text-xl text-red-400'>
                Plans
              </label>
              <div
                id='plans-field'
                aria-label='plans-field'
                className='flex items-center justify-between border-b-1 border-neutral-400 w-full p-1 shadow-md'
              >
                <p>2</p>
                <button
                  id='manage-plans-button'
                  aria-label='manage-plans-button'
                  className='hover:scale-110 hover:cursor-pointer hover:text-red-400 transition-all active:brightness-60'
                >
                  Manage
                </button>
              </div>
            </div>

            
            <div id="conversations-container">
              <label htmlFor='conversations-field' className='text-xl text-red-400'>
                Conversations
              </label>

              <div
                id='conversations-field'
                aria-label='conversations-field'
                className='flex items-center justify-between border-b-1 border-neutral-400 w-full p-1 shadow-md'
              >
                <p>3</p>
                <button
                  id='manage-conversations-button'
                  aria-label='manage-conversations-button'
                  className='hover:scale-110 hover:cursor-pointer hover:text-red-400 transition-all active:brightness-60'
                >
                  Manage
                </button>
              </div>
            </div>

            <div id="messages-container">
              <label htmlFor='messages-field' className='text-xl text-red-400'>
                Messages
              </label>
              <p
                id='messages-field'
                aria-label='messages-field'
                className='border-b-1 border-neutral-400 w-full p-1 shadow-md'
              >
                37
              </p>
            </div>

          </motion.section>
        </AnimatePresence>

      </div>

      
    </div>
  );
}
