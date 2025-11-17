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
      onClick={(e) => {
        e.stopPropagation();
        setOpenSideBarAction(!openSideBar);
      }}
      className={`
        ${openSideBar ? 'max-[1024px]:bg-red-400 max-[1024px]:hover:bg-red-700 rounded-md px-2' : ''}
        ${openSideBar ? 'max-[1024px]:left-79 max-[392px]:left-58 max-[1024px]:-top-2.5' : 'max-[1024px]:left-1 max-[1024px]:-top-2.5'}
        flex justify-center items-center flex-col ml-3 mt-3 w-8 h-10 hover:cursor-pointer rounded-md transition-all duration-150 z-2
        max-[1024px]:absolute min-[1024px]:hover:opacity-50
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
