'use client';

import { ClipboardCheckIcon, User, House } from 'lucide-react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { Conversation } from '@/app/lib/definitions';
import { usePathname } from 'next/navigation';
import { FaCog } from 'react-icons/fa';
import animations from '../../../css/animations.module.css';
import Link from 'next/link';

export default function NavLinks({
  openSideBar,
  userConversations,
  loadingNavLinks,
}: {
  openSideBar: boolean;
  userConversations: Conversation[];
  loadingNavLinks: boolean;
}) {
  // identify what tab is selected
  const [tab, setTab] = useState<string>(''); 
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

  // dynamically select the right tab based on the URL if the page is refreshed
  useEffect(() => {
    const url = pathname.split('/');
    let endpoint = '';
    if (url.find(x => x === 'plans')) {
      endpoint = (url.find(x => x === 'plans') as string);
    } else if (url.find(x => x === 'profile')) {
      endpoint = (url.find(x => x === 'profile') as string);
    } else {
      endpoint = (url.find(x => x === 'dashboard') as string);
    }
    // capitalizing the first word
    const tabName = (endpoint as string).split('').map((word, i) => i === 0 ? word.toUpperCase() : word).join('') ;
    setTab(tabName);
  }, [pathname])

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
              data-testid={`${link.name.toLowerCase()}-tablink`}
              className={`
                ${tab.includes(link.name) && 'bg-[linear-gradient(-45deg,#151515_50%,#505050)] border border-neutral-500'}
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
                  ${(tab === link.name || conversationPage === pathname) && openSideBar && link.children.length > 0 ? 'flex flex-col p-2 mt-1 text-sm rounded-md bg-[linear-gradient(-45deg,#151515_50%,#505050)] border border-neutral-600 w-6/7 shadow-lg' : 'hidden'} transition-all duration-500
                `}
              >
                {loadingNavLinks && (
                  <div className='p-2 flex flex-col w-full h-full justify-center items-center shadow-lg rounded-lg'>
                    <AiOutlineLoading3Quarters
                      className={`${animations.loading} text-2xl`}
                    />
                    <h1 id='generating-header' className='mt-3'>
                      Loading...
                    </h1>
                  </div>
                )}
                {tab === link.name && !loadingNavLinks && (
                  link.children.map((child, index) => {
                    const conversation = child as Conversation;
                    return (
                      <Link
                        key={conversation.id}
                        data-testid={`${conversation.title.split(' ').join('-').toLowerCase()}-title`}
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
                {link.name === 'Dashboard' && link.children && (
                  <Link
                    data-testid={`manage-conversations-title`}
                    className={`
                    ${conversationId === 'manage-conversations' && 'bg-red-500'}
                    border border-neutral-500
                    mt-2 hover:cursor-pointer hover:bg-red-400 text-start p-1 rounded-sm transition-all
                  `}
                    href='/dashboard/manage-conversations'
                    onClick={() => {
                      setTab(link.name);
                      setConversationId('manage-conversations');
                      setConversationPage(`${link.href}/manage-conversations`);
                    }}
                  >
                    <p className='lg:flex items-center justify-start hidden'>
                      <FaCog className='mr-2' />
                      Manage conversations
                    </p>
                    <p className='lg:hidden items-center justify-start flex'>
                      <FaCog className='mr-2' />
                      Manage
                    </p>
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
