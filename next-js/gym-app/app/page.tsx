'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Orbitron } from 'next/font/google';
import styles from './css/home.module.css';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function Home() {
  // wrapping motion with Link
  const MotionLink = motion.create(Link);

  return (
    <div className={`${styles.diagonal} w-full flex justify-start items-start h-screen relative antialiased overflow-hidden p-6`}>

      <div 
        className={`${styles.gym_wrapper} absolute right-0 w-full h-screen opacity-50 -z-2`} 
        id='gym-photo-wrapper'
      >
        <img
          src='/home-page-gym-photo.jpg'
          alt='gym-photo'
          id='gym-photo'
          className='object-cover w-full h-screen'
        />
      </div>

      <main className='w-full flex flex-col'>

        <div className={`w-20 h-20 md:w-30 md:h-30 rounded-full relative mb-4 xl:mb-10 ${styles.shadow_custom_white}`} id='logo-image-wrapper'>
          <Image
            src='/logo_clean_white.png'
            alt='brand-logo'
            id='logo-img'
            className='object-cover'
            fill
          />
        </div>

        <h2
          id='diversus-lettering'
          className={`border-b-2 text-center w-fit mb-15 lg:text-xl xl:text-3xl ${orbitron.className} ${styles.diversus_lettering}`}
        >
          Diversus
        </h2>

        <div className='border-1 border-neutral-300 lg:text-xl xl:text-3xl rounded-lg w-fit p-2 backdrop-blur-2xl flex items-center justify-center' id='desc-header-wrapper'>
          <h1 className='text-md font-bold text-center' id='desc-header'>
            AI-Personalized Fitness & Nutrition Platform
          </h1>
        </div>

        <p className='text-red-400 xl:text-xl' data-testid='brandnewself'>&quot;A brand new self, reborn&quot;</p>

        <div className='flex flex-col justify-between items-start'>
          <MotionLink
            href='/get-started'
            className={`${styles.get_started_colors} xl:w-70 text-center rounded-md text-2xl mt-10 w-50 p-2 hover:cursor-pointer`}
            id='get-started-btn'
            whileHover={{
              scale: 1.1,
              color: '#E63946',
              boxShadow: `0 0 20px 2px #E63946`,
            }}
            whileTap={{ scale: 1.05 }}
          >
            Get Started
          </MotionLink>
          <MotionLink
            href='/login'
            className={`xl:w-70 text-center rounded-md text-2xl mt-10 w-50 p-2 hover:cursor-pointer ${styles.login_button_colors}`}
            id='login-btn'
            whileHover={{
              scale: 1.1,
              color: '#121212',
              boxShadow: `0 0 20px 2px #2E2E2E`,
            }}
            whileTap={{ scale: 1.05 }}
          >
            Log In
          </MotionLink>
        </div>

        <p id='copyright' data-testid='copyright' className='absolute bottom-0 text-center'>
          © 2025 Gabriel Cezar — All rights reserved.
        </p>
      </main>

    </div>
  );
}
