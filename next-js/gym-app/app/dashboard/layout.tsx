import { Metadata } from 'next';
import { auth } from '@/app/actions/credential-handler';
import { getUser } from '@/app/actions/auth';
import { Conversation } from '../lib/definitions';
import postgres from 'postgres';
import SideBar from '../ui/dashboard/sidebar/sidebar-wrapper';

// instantiating the db
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Layout({ children }: { children: React.ReactNode }) {

  const session = await auth();
  
  const email = session?.user?.email;

  if (!email) throw new Error('Missing user email.');

  // server side user fetch
  const user = await getUser(email);

  // // querying for user conversations in order to to display them in nav-links.tsx
  // const userConversations = await sql<Conversation[]>`
  //   SELECT * FROM conversations
  //   WHERE user_id = ${user!.id}
  // `

  return (
    <div className='flex w-full'>
      <SideBar user={user} />
      {children}
    </div>
  );
}
