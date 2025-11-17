'use client';

import { ClipboardCheckIcon, User, House } from 'lucide-react';
import { usePathname } from 'next/navigation';
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
  // identify what tab is selected
  const [tab, setTab] = useState<string>('Dashboard'); 
  // UI-helper to highlight what conversation the user is on
  const [conversationId, setConversationId] = useState<string>(''); // what
  // UI-helper to prevent a blank div to appear under 
  // Dashboard tab link if any other tab link is selected
  const [conversationPage, setConversationPage] = useState<string>('');
  // current url link
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
      name: 'Profile',
      href: '/dashboard/profile',
      icon: User,
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
  }, [pathname]);

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
              onClick={() => setTab(link.name)}
              className={`
                ${tab === link.name && 'bg-neutral-900'}
                ${openSideBar ? 'flex' : 'hidden'} 
                justify-between items-center mt-2 p-2 w-full hover:bg-neutral-800
                rounded-md transition-all duration-150 hover:cursor-pointer 
                `}
            >
              {link.name}
              <link.icon />
            </Link>
            <div className='w-full flex items-center justify-end'>
              <div
                className={`
                  ${(tab === link.name || conversationPage === pathname) && openSideBar && link.children.length > 0 ? 'flex flex-col p-2 mt-1 text-sm rounded-md bg-neutral-800 w-6/7' : 'hidden'} transition-all duration-500
                `}
              >
                {tab === link.name && (
                  link.children.map((child, index) => {
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
                        onClick={() => {
                          setTab(link.name);
                          setConversationId(conversation.id);
                          setConversationPage(`${link.href}/${conversation.id}`);
                        }}
                      >
                        {link.name === 'Dashboard' && conversation.title}
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
