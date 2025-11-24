'use client';

import { motion } from 'motion/react';
import { SetStateAction, Dispatch } from 'react';

export default function SideBarButton({
  openSideBar,
  setOpenSideBarAction,
  sideBarButtonRef,
}: {
  openSideBar: boolean;
  setOpenSideBarAction: Dispatch<SetStateAction<boolean>>;
  sideBarButtonRef: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <button
      ref={sideBarButtonRef}
      id='three-bars-menu'
      data-testid='three-bars-menu'
      onClick={(e) => {
        e.stopPropagation();
        setOpenSideBarAction(!openSideBar);
      }}
      className={`
        ${openSideBar ? 'left-61 lg:left-81' : 'left-2'}
        ${openSideBar && 'bg-[linear-gradient(45deg,#000_50%,#606060)] border-neutral-600 border-1 rounded-md px-6'}
        flex justify-center items-center flex-col w-8 h-10 hover:cursor-pointer rounded-md transition-all duration-150
        absolute top-1 hover:brightness-50
      `}
    >
      <motion.div
        className='w-6 h-[2px] bg-white mb-1 rounded-sm'
        animate={{
          rotate: openSideBar ? 45 : 0,
          y: openSideBar ? 6 : 0,
        }}
        transition={{
          duration: 0.3,
        }}
      />
      <motion.div
        className='w-6 h-[2px] bg-white mb-1 rounded-sm'
        animate={{
          opacity: openSideBar ? 0 : 100,
        }}
        transition={{
          duration: 0.3,
        }}
      />
      <motion.div
        className='w-6 h-[2px] bg-white rounded-sm'
        animate={{
          rotate: openSideBar ? -45 : 0,
          y: openSideBar ? -6 : 0,
        }}
        transition={{
          duration: 0.3,
        }}
      />
    </button>
  );
}
