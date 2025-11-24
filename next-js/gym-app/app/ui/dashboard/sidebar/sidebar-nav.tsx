'use client';

import React, { SetStateAction, useActionState } from 'react';
import { signUserOut } from '@/app/actions/auth';
import { Loader2, Power } from 'lucide-react';
import styles from '../../../css/animations.module.css';
import SideBarButton from './sidebar-button';

export default function SideBarNav({
  openSideBar,
  setOpenSideBar,
  children,
  sideBarNavRef,
  sideBarButtonRef
}: {
  openSideBar: boolean;
  setOpenSideBar: React.Dispatch<SetStateAction<boolean>>
  children: React.ReactNode;
  sideBarNavRef: React.RefObject<HTMLElement | null>;
  sideBarButtonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [errorMessage, formAction, isPending] = useActionState(
    signUserOut,
    undefined
  );

  return (
    <nav
      ref={sideBarNavRef}
      id='sidebar'
      data-testid='sidebar-panel'
      className={`
        ${openSideBar ? 'w-60 lg:w-80 border-neutral-400 border-r-2' : 'w-0 border-transparent'}
        fixed h-screen top-0 left-0
      bg-neutral-600 flex flex-col justify-start items-center transition-all
      `}
      onClick={e => e.stopPropagation()}
    >
      <SideBarButton
        openSideBar={openSideBar}
        setOpenSideBarAction={setOpenSideBar}
        sideBarButtonRef={sideBarButtonRef}
      />

      {children}

      <form
        action={formAction}
        id='signOutForm'
        className={`
          absolute bottom-6 w-full transition-all duration-500 ease-in
          ${openSideBar ? 'flex items-center justify-center opacity-100' : 'opacity-0'}
        `}
      >
        <button
          className={`  
            ${isPending ? 'bg-neutral-800' : 'bg-transparent'}
            ${openSideBar ? 'flex items-center justify-between' : 'hidden'}
             p-2 text-center text-lg w-11/12 rounded-md  text-white mt-2
             hover:cursor-pointer hover:bg-neutral-800 transition-all duration-300 
          `}
          aria-label='sign-out-button'
          id='sign-out-button'
        >
          {isPending ? (
            <>
              Signing out... <Loader2 className={`${styles.loading} ml-5`} />
            </>
          ) : (
            <>
              Sign Out <Power className='ml-5' size={20} />
            </>
          )}
        </button>
      </form>
    </nav>
  );
}
