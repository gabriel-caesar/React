import { getUser } from '@/app/actions/auth';
import { auth } from '@/app/actions/credential-handler';
import ProfileCard from '@/app/ui/dashboard/profile/profile-card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function Page() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('Missing user email.');  
  const user = await getUser(email); // server side user fetch

  return (
    <div className='flex justify-center items-center w-screen px-4 py-20 '>
      <ProfileCard user={user} />
    </div>
  )
}