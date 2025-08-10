'use client'

import { ClipboardCheckIcon, UsersRound, House, Power } from 'lucide-react';
import { signUserOut } from '../../actions/auth';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';

export default function SideBarNav({ openSideBar }: { openSideBar: boolean }) {

  const MotionLink = motion.create(Link);

  return (
    <nav
      id='sidebar'
      className={`h-screen bg-neutral-600 ${openSideBar ? 'w-100' : 'w-0'} flex flex-col justify-start items-center relative transition-all`}
    >
      <MotionLink 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        href='/dashboard'
        className={`${openSideBar ? 'flex' : 'hidden'} justify-between items-center mt-2 p-2 w-11/12 rounded-md transition-all duration-150 hover:cursor-pointer hover:bg-neutral-800`}
      >
        Dashboard
        <House strokeWidth={1.5} />
      </MotionLink>

      <MotionLink 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        href='/dashboard/plans'
        className={`${openSideBar ? 'flex' : 'hidden'} justify-between items-center mt-2 p-2 w-11/12 rounded-md transition-all duration-150 hover:cursor-pointer hover:bg-neutral-800`}
      >
        Plans
        <ClipboardCheckIcon strokeWidth={1.5} />
      </MotionLink>

      <MotionLink 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        href='/dashboard/friends'
        className={`${openSideBar ? 'flex' : 'hidden'} justify-between items-center mt-2 p-2 w-11/12 rounded-md transition-all duration-150 hover:cursor-pointer hover:bg-neutral-800`}
      >
        Friends
        <UsersRound strokeWidth={1.5} />
      </MotionLink>

      <motion.form
        action={async () => await signUserOut()}
        className='absolute bottom-2 w-full'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        
        <button
          className={`${openSideBar ? 'flex m-auto' : 'hidden'} items-center justify-between p-2 text-center text-lg w-11/12 rounded-md bg-transparent text-white hover:cursor-pointer hover:bg-neutral-800 transition-all duration-150 mt-2`}
        >
          Sign Out
          <Power className='ml-5' size={20} />
        </button>
      </motion.form>
    </nav>
  );
}
