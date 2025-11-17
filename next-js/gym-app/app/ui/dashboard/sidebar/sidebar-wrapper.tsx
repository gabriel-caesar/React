'use client';

import SideBarNav from './sidebar-nav';
import SideBarButton from './sidebar-button';
import NavLinks from './nav-links';
import { useEffect, useRef, useState } from 'react';
import { Conversation, User } from '@/app/lib/definitions';
import { usePathname } from 'next/navigation';

export default function SideBar({
  user,
}: {
  user: User | undefined;
}) {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [userConversations, setUserConversations] = useState<Conversation[]>([]);
  const sideBarNavRef = useRef<HTMLElement | null>(null);
  const sideBarButtonRef = useRef<HTMLButtonElement | null>(null);

  const pathname = usePathname();

  // if the mouse click event was outside the sidebar container or not in the sidebar button, close it
  useEffect(() => {
    function handleClickOff(e: MouseEvent) {
      if (window.innerWidth >= 1024) return; // don't close on large screens

      if (
        !sideBarNavRef.current?.contains(e.target as Node) &&
        !sideBarButtonRef.current?.contains(e.target as Node)
      ) {
        setOpenSideBar(false);
      }
    }

    window.addEventListener('click', handleClickOff);

    return () => {
      window.removeEventListener('click', handleClickOff);
    };
  }, []);

  // get the brand new conversation dynamically when it is created
  useEffect(() => {
    async function fetchLatestConversations() {
      if (user) {
        const res = await fetch('/api/chat/get-latest-conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: user
          })
        });
        const data = await res.json();
        setUserConversations(data.conversations);
      }
    }

    fetchLatestConversations();
  }, [pathname])

  return (
    <>
      <SideBarNav openSideBar={openSideBar} sideBarNavRef={sideBarNavRef}>
        <NavLinks
          openSideBar={openSideBar}
          userConversations={userConversations}
        />
      </SideBarNav>

      <SideBarButton
        openSideBar={openSideBar}
        setOpenSideBarAction={setOpenSideBar}
        sideBarButtonRef={sideBarButtonRef}
      />
    </>
  );
}
