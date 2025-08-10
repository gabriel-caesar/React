import SideBar from '../ui/dashboard/sidebar-wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex w-full'>
      <SideBar />
      {children}
    </div>
  );
}
