import { getUser } from '@/app/actions/auth';
import { getLatestConversations } from '@/app/actions/chat';
import { auth } from '@/app/actions/credential-handler';
import ManagePanel from '@/app/ui/dashboard/manage-conversations/manage-panel';

export default async function Page() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('Missing user email.');
  const user = await getUser(email); // server side user fetch
  const userId = user ? user.id : '';
  const conversations = await getLatestConversations(userId); // getting all conversation data from the current user

  // converting the date type to string
  conversations.forEach(c => {
    for (const prop in c) {
      if (prop === 'created_date') {
        c[prop] = c[prop].toLocaleString() as any
      }

      if (prop === 'last_message_date') {
        c[prop] = c[prop].toLocaleString() as any
      }
    }
  })

  return (
    <div
      id='manage-conversations-container'
      className='flex flex-col justify-center items-center w-full px-4 py-20'
    >
      <ManagePanel conversations={conversations} />
    </div>
  )
}