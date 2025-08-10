'use server'

import { auth } from '@/app/actions/credential-handler';
import { getUser } from '@/app/actions/auth';
import AIChat from '../ui/dashboard/ai-chat';

export default async function Page() {
  const session = await auth();

  const email = session?.user?.email;

  if (!email) throw new Error('Missing user email.');

  // server side user fetch
  const user = await getUser(email);

  return (
    <div
      id='main-panel'
      className='flex flex-col items-center justify-center h-screen w-full overflow-hidden'
    >
      <AIChat user={user} />
    </div>
  );
}
