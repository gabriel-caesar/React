'use client';

import { ClipboardCheckIcon, UsersRound, House } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function NavLinks({ openSideBar }: { openSideBar: boolean }) {
  const pathname = usePathname();
  const MotionLink = motion.create(Link);
  const links = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: House,
    },
    {
      name: 'Plans',
      href: '/dashboard/plans',
      icon: ClipboardCheckIcon,
    },
    {
      name: 'Friends',
      href: '/dashboard/friends',
      icon: UsersRound,
    },
  ];

  return (
    <div className='mt-6 w-11/12'>
      {links.map((link) => {
        return (
          <MotionLink
            key={link.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            href={link.href}
            className={`
              ${pathname === link.href && 'bg-neutral-900'}
              ${openSideBar ? 'flex' : 'hidden'} justify-between items-center mt-2 p-2 w-full rounded-md transition-all duration-150 hover:cursor-pointer hover:bg-neutral-800
              `}
          >
            {link.name}
            <link.icon />
          </MotionLink>
        );
      })}
    </div>
  );
}
