import PlansCard from '@/app/ui/dashboard/plans/plans-card';
import { getUser } from '@/app/actions/auth';
import { auth } from '@/app/actions/credential-handler';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plans',
};

export default async function Page() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('Missing user email.');
  const user = await getUser(email); // server side user fetch

  return (
    <div className='flex justify-center items-center w-screen px-4 py-20 '>
      <PlansCard user={user}/>
    </div>
  )
}