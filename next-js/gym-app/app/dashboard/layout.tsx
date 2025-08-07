import SideBar from '../ui/sidebar-wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex w-screen'>
      <SideBar />
      {children}
    </div>
  );
}
