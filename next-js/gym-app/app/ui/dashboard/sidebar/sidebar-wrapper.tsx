'use client';

import SideBarNav from './sidebar-nav';
import SideBarButton from './sidebar-button';
import NavLinks from './nav-links';
import { useEffect, useState } from 'react';
import { Conversation } from '@/app/lib/definitions';

export default function SideBar({ userConversations }: { userConversations: Conversation[] }) {
  const [openSideBar, setOpenSideBar] = useState(false);

  useEffect(() => {
    function handleClickOff(e: MouseEvent) {
      
    }

    window.addEventListener('click', handleClickOff);

    return () => {
      window.removeEventListener('click', handleClickOff);
    }
  }, [])

  return (
    <>
      <SideBarNav 
        openSideBar={openSideBar}
      >
        <NavLinks openSideBar={openSideBar} userConversations={userConversations} />
      </SideBarNav>
      
      <SideBarButton
        openSideBar={openSideBar}
        setOpenSideBarAction={setOpenSideBar}
      />
    </>
  );
}
