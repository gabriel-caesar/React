'use client';

import { signUserOut } from '../../actions/auth';
import { Power } from 'lucide-react';
import React from 'react';
import NavLinks from './nav-links';

export default function SideBarNav({ openSideBar }: { openSideBar: boolean }) {

  return (
    <nav
      id='sidebar'
      className={`
          ${openSideBar ? 'max-[1024px]:w-80 max-[392px]:w-60 max-[1024px]:border-neutral-400 w-100 border-r-2' : 'w-0'}
          max-[1024px]:absolute max-[1024px]:z-2
          h-screen border-transparent bg-neutral-600 flex flex-col justify-start items-center relative transition-all
        `}
    >
      
      <NavLinks openSideBar={openSideBar} />

      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          await signUserOut();
        }}
        id='signOutForm'
        className={`
          absolute bottom-6 w-full
          ${openSideBar ? 'flex items-center justify-center' : 'hidden'}
        `}
      >
        <button
          className={`${openSideBar ? 'opacity-100' : 'opacity-0'} flex items-center justify-between p-2 text-center text-lg w-11/12 rounded-md bg-transparent text-white hover:cursor-pointer hover:bg-neutral-800 transition-all duration-300 mt-2`}
        >
          Sign Out
          <Power className='ml-5' size={20} />
        </button>
      </form>
    </nav>
  );
}
