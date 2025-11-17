import { auth } from '@/app/actions/credential-handler';
import { getUser } from '@/app/actions/auth';
import { Metadata } from 'next';
import SideBar from '../ui/dashboard/sidebar/sidebar-wrapper';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await auth();
  
  const email = session?.user?.email;

  if (!email) throw new Error('Missing user email.');

  // server side user fetch
  const user = await getUser(email);

  return (
    <div className='flex w-full'>
      <SideBar user={user} />
      {children}
    </div>
  );
}
