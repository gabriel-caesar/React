'use server'

import { auth } from '@/app/actions/credential-handler';
import { getUser } from '@/app/actions/auth';
import ChatStructure from '../ui/dashboard/ai-chat/chat-structure';

export default async function Page() {
  const session = await auth();

  const email = session?.user?.email;

  if (!email) throw new Error('Missing user email.');

  // server side user fetch
  const user = await getUser(email);

  // conversation and messages reveice no data, because
  // this route doesn't depend on an existing conversations
  return (
    <div
      id='main-panel'
      className='flex flex-col items-center justify-center h-screen w-full overflow-hidden'
    >
      <ChatStructure user={user} conversation={null} messages={[]} />
    </div>
  );
}
