'use client';

import SideBarNav from './sidebar-nav';
import SideBarButton from './sidebar-button';
import { useState } from 'react';

export default function SideBar() {
  const [openSideBar, setOpenSideBar] = useState(false);

  return (
    <>
      <SideBarNav 
        openSideBar={openSideBar}
      />
      <SideBarButton
        openSideBar={openSideBar}
        setOpenSideBarAction={setOpenSideBar}
      />
    </>
  );
}
