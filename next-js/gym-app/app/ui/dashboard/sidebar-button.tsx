'use client'

import { motion } from 'motion/react';
import { SetStateAction, Dispatch } from 'react';

export default function SideBarButton({ openSideBar, setOpenSideBarAction }: { openSideBar: boolean, setOpenSideBarAction: Dispatch<SetStateAction<boolean>>}) {
  return (
    <button
      id='three-bars-menu'
      onClick={() => setOpenSideBarAction(!openSideBar)}
      className='flex justify-center items-center flex-col ml-3 mt-3 w-8 h-10 hover:cursor-pointer hover:opacity-50 rounded-md transition-all duration-150'
    >

      <motion.div
        className='w-6 h-[2px] bg-white mb-1 rounded-sm'
        animate={{
          rotate: openSideBar ? 45 : 0,
          y: openSideBar ? 6 : 0
        }}
        transition={{
          duration: 0.3
        }}
      />
      <motion.div
        className='w-6 h-[2px] bg-white mb-1 rounded-sm'
        animate={{
          opacity: openSideBar ? 0 : 100
        }}
        transition={{
          duration: 0.3
        }}
      />
      <motion.div
        className='w-6 h-[2px] bg-white rounded-sm'
        animate={{
          rotate: openSideBar ? -45 : 0,
          y: openSideBar ? -6 : 0
        }}
        transition={{
          duration: 0.3
        }}
      />

    </button>
  )
}