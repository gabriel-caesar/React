'use client'

import { User } from '@/app/lib/definitions';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
})

export default function PlansCard({ user } : { user: User | undefined}) {
  return (
    <div
      id='plans-card-container'
      className='
        flex flex-col items-center justify-start rounded-md border-1 border-neutral-400
        bg-[linear-gradient(45deg,#525252_50%,#737373)]
      '
    >
      <h1
        id='plans-header'
        aria-label='plans-header'
        className={`${orbitron.className} text-xl text-center`}
        style={{
          letterSpacing: '0.3rem'
        }}
      >
        Your Plans
      </h1>

    </div>
  )
}