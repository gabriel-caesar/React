'use server'

import { auth } from '@/app/actions/credential-handler';
import { getUser } from '@/app/actions/auth';
import { Conversation, Message } from '@/app/lib/definitions';
import ChatStructure from '@/app/ui/dashboard/ai-chat/chat-structure';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export default async function Page({ params }: { params: Promise<{ conversationId: string }> }) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) throw new Error('Missing user email.');
  // server side user fetch
  const user = await getUser(email);

  // getting the URL endpoint as the conversation id
  const endpoint = await params;
  const conversationId = endpoint.conversationId;

  // querying the database
  const conversationQuery = await sql<Conversation[]>`
    SELECT * FROM conversations
    WHERE id = ${conversationId};
  `
  const messages = await sql<Message[]>`
    SELECT * FROM messages
    WHERE conversation_id = ${conversationId}
  `
  
  // data from db
  const conversation = conversationQuery[0];

  // as this route receives data from existing conversations
  // messages and conversation have the data they need to display the
  // conversation history to the user and give its context to the AI
  return (
    <div
      id='main-panel'
      className='flex flex-col items-center justify-center h-screen w-full overflow-hidden'
    >
      <ChatStructure user={user} conversation={conversation} messages={messages} />
    </div>
  );
}
