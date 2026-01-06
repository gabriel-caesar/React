import { getUser } from '@/app/actions/auth';
import { getLatestConversations } from '@/app/actions/chat';
import { auth } from '@/app/actions/credential-handler';
import { NextResponse } from 'next/server';

export async function GET() {
  // server side user fetch
  const session = await auth();
  const email = session?.user?.email; 
  if (!email) throw new Error('Missing user email.');
  const user = await getUser(email);

  try {
    const userConversations = await getLatestConversations(user ? user.id : '')
    if (userConversations) return NextResponse.json({ conversations: userConversations })
    return NextResponse.json({ conversations: false });
  } catch (error) {
    throw new Error(`Couldn't process get-latest-conversations API. ${error}`)
  }
}