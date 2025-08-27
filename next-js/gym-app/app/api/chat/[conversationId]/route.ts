'use server'

import { handleRequest } from '@/app/actions/chat';
import OpenAI from 'openai';

// storing OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;

// instantiating a new OpenAI Client
const openai = new OpenAI({ apiKey: apiKey });

export async function POST(req: Request, { params }: { params: Promise<{ conversationId: string }> }) {
  // handles the request for the conversation
  const { conversationId } = await params;

  return await handleRequest(req, openai, conversationId);
}
