'use client';

import { ClipboardCheckIcon, UsersRound, House } from 'lucide-react';
import {usePathname } from 'next/navigation';
import { Conversation } from '@/app/lib/definitions';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NavLinks({
  openSideBar,
  userConversations,
}: {
  openSideBar: boolean;
  userConversations: Conversation[];
}) {
  const [conversationId, setConversationId] = useState<string>('');
  const pathname = usePathname();
  const links = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: House,
      children: userConversations,
    },
    {
      name: 'Plans',
      href: '/dashboard/plans',
      icon: ClipboardCheckIcon,
      children: [],
    },
    {
      name: 'Friends',
      href: '/dashboard/friends',
      icon: UsersRound,
      children: [],
    },
  ];

  // if user unselects any children link, unhighlight it
  useEffect(() => {
    if (!pathname.includes(conversationId)) setConversationId('');
  }, [pathname]);

  // if the user refreshed the page while inside a conversation
  // the conversationId got erased, now it persists
  useEffect(() => {
    const split = pathname.split('/');
    const endpoint = split[split.length - 1];
    if (endpoint !== '') setConversationId(endpoint);
  }, []);

  return (
    <div className='mt-6 w-11/12'>
      {links.map((link) => {
        return (
          <div 
            className={`flex flex-col transition-all duration-500 ease-in ${openSideBar ? 'opacity-100' : 'opacity-0'}`} 
            key={link.name}
          >
            <Link
              href={link.href}
              className={`
                ${pathname === link.href && 'bg-neutral-900'}
                ${pathname === `${link.href}/${conversationId}` && 'bg-neutral-900'}
                ${openSideBar ? 'flex' : 'hidden'} justify-between items-center mt-2 p-2 w-full rounded-md transition-all duration-150 hover:cursor-pointer hover:bg-neutral-800
                `}
            >
              {link.name}
              <link.icon />
            </Link>
            <div className='w-full flex items-center justify-end'>
              <div
                className={`${(pathname === link.href || pathname === `${link.href}/${conversationId}`) && openSideBar ? 'flex flex-col max-h-fit p-2 mt-1 text-sm w-6/7' : 'hidden max-h-0'} rounded-md bg-neutral-800 transition-all`}
              >

                <p
                  className={`${link.children.length > 0 ? 'hidden' : 'flex'}`}
                >
                  {link.name === 'Dashboard'
                    ? 'No conversations to show'
                    : link.name === 'Friends'
                      ? 'No friends to show'
                      : 'No plans created yet'}
                </p>

                {link.children.map((child, index) => {
                  const conversation = child as Conversation;
                  return (
                    <Link
                      key={index} // find out another way to assign a key
                      className={`
                        ${conversationId === conversation.id && 'bg-red-500'}
                        [&:not(:last-child)]:mb-2 hover:cursor-pointer hover:bg-red-400 text-start px-2 rounded-sm transition-all
                      `}
                      href={
                        link.name === 'Dashboard'
                          ? `${link.href}/${conversation.id}`
                          : link.href
                      }
                      onClick={() => setConversationId(conversation.id)}
                    >
                      {link.name === 'Dashboard' && conversation.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
