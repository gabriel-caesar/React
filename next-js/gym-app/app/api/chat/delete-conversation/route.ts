'use server';

import { deleteConversation } from '@/app/actions/chat';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {
    id,
  }: {
    id: string;
  } = await req.json();

  try {
    await deleteConversation(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    throw new Error(`Couldn't delete conversation from API call. ${error}`);
  }
}
