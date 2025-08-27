'use client';

import SideBarNav from './sidebar-nav';
import SideBarButton from './sidebar-button';
import NavLinks from './nav-links';
import { useState } from 'react';
import { Conversation } from '@/app/lib/definitions';

export default function SideBar({ userConversations }: { userConversations: Conversation[] }) {
  const [openSideBar, setOpenSideBar] = useState(false);

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
