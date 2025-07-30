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
    <div className='flex justify-center items-center h-screen antialiased'>
      <div className={`absolute top-10 left-10 w-40 h-40 rounded-full ${styles.shadow_custom_white}`}>
        <Image
          src='/logo_clean_white.png'
          alt='brand-logo'
          id='logo-img'
          className='w-full absolute -top-1.5'
          width={500}
          height={500}
        />
      </div>

      <div className={`${styles.diagonal} ${styles.gym_wrapper} absolute right-0 w-260 -z-1`} id='gym-wrapper'>
        <Image
          src='/home-page-gym-photo.jpg'
          alt='gym-photo'
          id='gym-photo'
          priority={false}
          width={1100}
          height={1100}
        />
      </div>

      <main className='absolute flex flex-col left-10 mt-20'>
        <h2
          id='diversus-lettering'
          className={`text-3xl border-b-2 text-center w-66 mb-15 ${orbitron.className} ${styles.diversus_lettering}`}
        >
          Diversus
        </h2>
        <h1 className='text-3xl font-bold'>
          AI-Personalized Fitness & Nutrition Platform
        </h1>
        <p className='text-red-400'>&quot;A brand new self, reborn&quot;</p>

        <div className='flex w-115 justify-between items-center'>
          <MotionLink
            href='/get-started'
            className={`${styles.get_started_colors} text-center rounded-md text-2xl mt-10 w-50 p-2 hover:cursor-pointer`}
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
            className={`text-center rounded-md text-2xl mt-10 w-50 p-2 hover:cursor-pointer ${styles.login_button_colors}`}
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
      </main>

      <p id='copyright' className='absolute bottom-0 left-10'>
        © 2025 Gabriel Cezar — All rights reserved.
      </p>
    </div>
  );
}
