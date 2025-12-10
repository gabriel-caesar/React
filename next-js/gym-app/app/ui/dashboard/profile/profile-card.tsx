'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { AnimatePresence, motion } from 'framer-motion';
import { editUserProfile } from '@/app/actions/profile';
import { Orbitron } from 'next/font/google';
import { IoClose } from 'react-icons/io5';
import { MdEdit } from 'react-icons/md';
import { User } from '@/app/lib/definitions';
import animations from '../../../css/animations.module.css';
import Link from 'next/link';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function ProfileCard({
  user,
  profilePictureUrl,
  conversationCount,
  messagesCount,
  plansCount,
}: {
  user: User | undefined;
  profilePictureUrl: string;
  conversationCount: number;
  messagesCount: number;
  plansCount: number;
}) {
  // server action
  const [state, editProfileAction, isPending] = useActionState(editUserProfile, undefined);

  // error wiggle animation utils
  const [wiggle, setWiggle] = useState<boolean>(false);
  const errorRef = useRef<HTMLParagraphElement | null>(null);

  // edit dialog
  const [editSuccessDialog, setEditSuccessDialog] = useState<boolean>(false);

  // profile picture states
  const [localUploadedPic, setLocalUploadedPic] = useState<File | null>(null);

  // flag to edit the profile data
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // input field hook states
  const [firstName, setFirstName] = useState<string>(
    user ? user?.firstname : ''
  );
  const [lastName, setLastName] = useState<string>(user ? user?.lastname : '');

  // shorten big image names
  function handleBigName(name: string) {
    const splitName = name.split('.')
    const condition = splitName[0].length > 11 ? splitName[0].slice(0, 11) + '...' : splitName[0]
    return `(${condition}).${splitName[1]}`
  }

  useEffect(() => {
    if (!errorRef.current) return
    const el = errorRef.current;
    el.classList.remove(animations.wiggle_input);
    void el.offsetWidth;
    el.classList.add(animations.wiggle_input);
  }, [wiggle]);

  useEffect(() => {
    if (!state?.errors) return;
    setWiggle(!wiggle);
  }, [setWiggle]);

  // hook to watch for success edits
  useEffect(() => {
    const editSuccess = searchParams.get('edit_success');
    if (editSuccess) setEditSuccessDialog(true);
  }, [])

  return (
    <form
      action={editProfileAction}
      id='profile-card-container'
      className='
        bg-[linear-gradient(45deg,#525252_50%,#737373)] md:w-1/2 xl:w-1/4 relative
        rounded-lg p-2 border-1 border-neutral-500 w-full flex flex-col items-center justify-start
      '
    >
      {editSuccessDialog && (
        <div
          id='dimmed-screen'
          className='fixed inset-0 w-screen h-screen z-9 bg-black/70'
        ></div>
      )}
      {editSuccessDialog && (
        <div
          id='edit-success-container'
          className='border border-neutral-500 fixed top-1/4 z-10 left-1/2 -translate-x-1/2 p-6 rounded-lg bg-neutral-800 shadow-lg text-[16px] flex flex-col justify-center items-center w-11/12 md:w-[550px]'
        >
          <h1
            id='edit-success-container'
            aria-label='edit-success-container'
            className='text-center mb-4'
          >
            Edited successfully
          </h1>
          <button
            id='dismiss-button'
            aria-label='dismiss-button'
            className='flex items-center justify-center text-lg text-neutral-200
              shadow-md bg-[linear-gradient(45deg,#525252_50%,#737373)] 
              rounded-lg px-2 border-1 border-neutral-500 w-3/4 md:w-1/2 transition-all duration-200  
              hover:cursor-pointer hover:scale-105 hover:text-red-500 hover:border-red-500'
            onClick={() => {
              setEditSuccessDialog(false);
              const url = pathname.split('?');
              router.replace(url[0]);
            }}
          >
            Dismiss
          </button>
        </div>
      )}
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
          type='button'
          onClick={() => setEditProfile(!editProfile)}
          id='edit-profile-button'
          aria-label='edit-profile-button'
          className={`
            hover:cursor-pointer hover:text-red-400 shadow-lg group relative
            rounded-md text-xl p-2 mt-2 hover:scale-110 active:brightness-60 transition-all border border-neutral-500
            ${editProfile ? 'bg-neutral-700  hover:text-black scale:105' : 'bg-neutral-800'}
          `}
        >
          {editProfile ? <IoClose /> : <MdEdit />}
          <div
            id='view-plan-info'
            aria-label='view-plan-info'
            className='absolute text-white whitespace-nowrap right-0 -bottom-7.5 bg-neutral-700 rounded-lg px-2 py-1 w-fit text-center text-sm hover:cursor-default pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 transition-all duration-300'
          >
            {editProfile ? 'Close' : 'Edit profile'}
          </div>
        </button>
      </div>

      <motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        transition={{duration: 0.5}}
        id='avatar-container'
        className='aspect-square border-1 border-neutral-400 rounded-full overflow-hidden w-2/6 mt-4 shadow-lg'
      >
        <img
          src={profilePictureUrl ? profilePictureUrl : '/standard_avatar_icon.png'}
          alt='avatar-icon'
          className='object-cover h-full w-full'
        />
      </motion.div>

      <div
        key={'picture-input-key'}
        id='change-picture-wrapper'
        className={`
          ${editProfile ? 'my-3 opacity-100' : 'opacity-0'} transition-all duration-300 bg-neutral-800
          border-1 border-neutral-400 rounded-md flex items-center justify-between w-full shadow-md
        `}
      >
        <button
          type='button'
          id='choose-file-button'
          aria-label='choose-file-button'
          className='
            hover:text-red-400 hover:scale-102
            hover:cursor-pointer active:brightness-50 
            py-1 px-3 transition-all border-r-1 border-neutral-400 w-full
          '
          onClick={() => document.getElementById('profile-picture-input')?.click()}
        >
          Choose file
        </button>
        <div
          id='file-names-container'
          aria-label='file-names-container'
          className='w-full py-1 px-3 text-center'
        >
          {localUploadedPic ? (
            <div
              id='profile-picture-container'
              aria-label='profile-picture-container'
              className='text-red-400'
            >
              <p id='picture-name-small-screen' className='md:hidden'>
                {handleBigName(localUploadedPic.name)}
              </p>
              <p id='picture-name-large-screen' className='hidden md:block'>
                {localUploadedPic.name}
              </p>
            </div>
          ) : 'No file chosen'}
          
        </div>
      </div>

      <AnimatePresence>
        {(localUploadedPic && editProfile) && (
          <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
            exit={{opacity:0}}
            transition={{duration:0.2}}
            id='preview-wrapper'
            className='flex flex-col justify-center items-center w-full'
          >
            <h3
              id='general-notes-header'
              aria-label='general-notes-header'
              className='rounded-md p-2 bg-neutral-700 shadow-md flex justify-start items-center text-white w-fit border-1 border-neutral-500 mb-2 text-[16px]'
            >
              Your picture preview
            </h3>
            <div
              id='picture-preview-container'
              className={`
                max-w-2/6 aspect-square
                transition-all overflow-hidden rounded-full border border-neutral-400 shadow-lg mb-2
              `}
            >
              {localUploadedPic && (
                <img 
                  id='preview-image'
                  alt='profile-picture'
                  src={URL.createObjectURL(localUploadedPic)}
                  className='w-full h-full object-cover'
                />
              )}  
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {state?.errors?.profile_picture && (
        <p
          ref={errorRef}
          id='profile-picture-error'
          aria-label='profile-picture-error'
          className={`
            ${wiggle && animations.wiggle_input}
            rounded-lg w-full text-center px-2 py-1 text-white my-2 
            text-[16px] bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-1 border-red-300 
          `}
        >
          {state?.errors?.profile_picture}
        </p>
      )}

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
                    if (e.target.value.length <= 30)
                      setFirstName(e.target.value);
                  }}
                  placeholder='Your first name...'
                  className='focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800'
                  id='edit-user-first-name'
                  name='firstname'
                  aria-label='edit-user-first-name'
                  type='text'
                  autoFocus
                />
              </AnimatePresence>
            )}
            {state?.errors?.firstname && (
              <p
                ref={errorRef}
                id='firstname-error'
                aria-label='firstname-error'
                className={`
                  ${wiggle && animations.wiggle_input}
                  rounded-lg w-full text-center px-2 py-1 text-white mt-2 
                  text-[16px] bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-1 border-red-300 
                `}
              >
                {state?.errors?.firstname}
              </p>
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
                  name='lastname'
                  onChange={(e) => {
                    if (e.target.value.length <= 30)
                      setLastName(e.target.value);
                  }}
                  placeholder='Your last name...'
                  className='focus-within:outline-none p-1 rounded-md border-1 border-neutral-400 bg-neutral-800'
                  id='edit-user-last-name'
                  aria-label='edit-user-last-name'
                  type='text'
                />
              </AnimatePresence>
            )}
            {state?.errors?.lastname && (
              <p
                ref={errorRef}
                id='lastname-error'
                aria-label='lastname-error'
                className={`
                  ${wiggle && animations.wiggle_input}
                  rounded-lg w-full text-center px-2 py-1 text-white mt-2 
                  text-[16px] bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-1 border-red-300 
                `}
              >
                {state?.errors?.lastname}
              </p>
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
            <div id='plans-container'>
              <label htmlFor='plans-field' className='text-xl text-red-400'>
                Plans
              </label>
              <div
                id='plans-field'
                aria-label='plans-field'
                className='flex items-center justify-between border-b-1 border-neutral-400 w-full p-1 shadow-md'
              >
                <p>{plansCount}</p>
                <Link
                  href='/dashboard/plans'
                  id='manage-plans-button'
                  aria-label='manage-plans-button'
                  className='hover:scale-110 hover:cursor-pointer hover:text-red-400 transition-all active:brightness-60'
                >
                  Manage
                </Link>
              </div>
            </div>

            <div id='conversations-container'>
              <label
                htmlFor='conversations-field'
                className='text-xl text-red-400'
              >
                Conversations
              </label>

              <div
                id='conversations-field'
                aria-label='conversations-field'
                className='flex items-center justify-between border-b-1 border-neutral-400 w-full p-1 shadow-md'
              >
                <p>{conversationCount}</p>
                <Link
                  href='/dashboard/manage-conversations'
                  id='manage-conversations-button'
                  aria-label='manage-conversations-button'
                  className='hover:scale-110 hover:cursor-pointer hover:text-red-400 transition-all active:brightness-60'
                >
                  Manage
                </Link>
              </div>
            </div>

            <div id='messages-container'>
              <label htmlFor='messages-field' className='text-xl text-red-400'>
                Messages
              </label>
              <p
                id='messages-field'
                aria-label='messages-field'
                className='border-b-1 border-neutral-400 w-full p-1 shadow-md'
              >
                {messagesCount}
              </p>
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
      {editProfile && (
        <div
          id='buttons-container'
          className='mt-8 flex flex-col md:flex-row w-full justify-center items-center'
        >
          <button
            type='button'
            id='cancel-edit-button'
            aria-label='cancel-edit-button'
            onClick={() => setEditProfile(false)}
            className={`
              ${isPending && 'hidden'}
              md:bg-[linear-gradient(-45deg,#101010_50%,#606060)] md:w-1/4 md:mr-2 bg-[linear-gradient(45deg,#101010_50%,#606060)]
              border-neutral-500 border text-[16px] w-full p-2 rounded-lg mb-2 md:mb-0 hover:cursor-pointer hover:text-red-400 
              hover:scale-105 active:scale-95 transition-all
            `}
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isPending}
            id='edit-button'
            aria-label='edit-button'
            className={`
              md:w-1/4 w-full p-2 rounded-lg transition-all flex items-center justify-center border text-[16px]
              ${
                isPending
                  ? 'bg-[linear-gradient(45deg,#202020_50%,#656565)] text-neutral-500 hover:cursor-not-allowed'
                  : 'bg-[linear-gradient(45deg,#101010_50%,#606060)] border-neutral-500 hover:text-red-400 hover:scale-105 active:scale-95 hover:cursor-pointer'
              }
            `}
          >
            {isPending ? (
              <>
                Editing{' '}
                <AiOutlineLoading3Quarters
                  strokeWidth={1.5}
                  className={`${animations.loading} ml-2`}
                />
              </>
            ) : (
              'Edit'
            )}
          </button>
        </div>
      )}
      <input 
        type='file'
        className='hidden'
        name='profile_picture'
        id='profile-picture-input'
        onChange={e => {
          let myFile;
          for (const file of e.target.files ?? '') {
            myFile = file
          }
          setLocalUploadedPic(myFile as File);
        }}
        readOnly
      />
      <input 
        type='text'
        name='user_id'
        className='hidden'
        id='user-id-hidden-input'
        value={user?.id}
        readOnly
      />
    </form>
  );
}
