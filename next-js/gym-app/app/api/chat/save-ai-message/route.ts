'use server'

import { Conversation, Message } from '@/app/lib/definitions';
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: Request) {

  // conversation placeholder
  let conversation: Conversation;
  
  // request destructuring
  const { aiChatBubble, userChatBubble, existingConversation } = await req.json();

  // ai chat destructuring
  const { message_content, role, id, sent_date } = aiChatBubble;

  // if this API is called over an existing conversation
  if (existingConversation) {
    conversation = existingConversation
  } else {
    // getting the brand new conversation created before this API call
    const brandNewConversationQuery = await sql<Conversation[]>`
      SELECT * FROM conversations
      WHERE id = (
        SELECT conversation_id FROM messages 
        WHERE message_content = ${userChatBubble.message_content} AND
         sent_date = ${userChatBubble.sent_date}
      );
    `
    conversation = brandNewConversationQuery[0];
  }

  // saves the AI response in the db
  try {
    // if response is not empty and conversation exists
    if (message_content && conversation) {
        // saving AI response on the bounce back after the
        // response stream is finished

        if (conversation) {
          const insertedResponse = await sql<Message[]>`
            INSERT INTO messages
            (id, sent_date, message_content, conversation_id, role)
            VALUES (${id}, ${sent_date}, ${message_content}, ${conversation.id}, ${role})
            RETURNING *;
          `;

          // update the last message sent from this conversation
          await sql`
            UPDATE conversations
            SET last_message_date = ${insertedResponse[0].sent_date}
            where id = ${conversation.id}
          `;  
        }

        // returning the redirect address to submitPrompt()
        return NextResponse.json({ redirectTo: `${conversation.id}` });
      }

      return NextResponse.json({ message: 'No conversation created' });
  } catch (error) {
    throw new Error(`Couldn't save AI response in DB. ${error}`)
  }
}