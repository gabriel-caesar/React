import { getLatestConversations } from '@/app/actions/chat';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

  const { user } = await req.json();

  try {

    const userConversations = await getLatestConversations(user.id)
    if (userConversations) {
      return NextResponse.json({ conversations: userConversations })
    }

    return NextResponse.json({ conversations: false });

  } catch (error) {
    throw new Error(`Couldn't process get-latest-conversations API. ${error}`)
  }
}