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

  console.log(
    `message_content: ${userChatBubble.message_content}\nsent_date: ${userChatBubble.sent_date}`
  )

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

  console.log(`conversation variable from API call: ${conversation.title}\nand its last_message_date: ${conversation.last_message_date}`)

  // saves the AI response in the db
  try {
    // if response is not empty and conversation exists
    if (message_content && conversation) {
        console.log(`Executed try block and response was not null!\n`)
        // saving AI response on the bounce back after the
        // response stream is finished

        if (conversation) {
          const insertedResponse = await sql<Message[]>`
            INSERT INTO messages
            (id, sent_date, message_content, conversation_id, role)
            VALUES (${id}, ${sent_date}, ${message_content}, ${conversation.id}, ${role})
            RETURNING *;
          `;
          console.log(`\n----# From "save-ai-message" #-----\n`)
          console.log(`\n1. Inserted message "${message_content}" from AI in conversation "${conversation.title}"\n`)
      
          // update the last message sent from this conversation
          await sql`
            UPDATE conversations
            SET last_message_date = ${insertedResponse[0].sent_date}
            where id = ${conversation.id}
          `;
          console.log(`\n2. Updated the last_message_date column from the current conversation "${conversation.title}".\n`)
  
        }

        // returning the redirect address to submitPrompt()
        return NextResponse.json({ redirectTo: `${conversation.id}` });
      }

      return NextResponse.json({ message: 'No conversation created' });
  } catch (error) {
    throw new Error(`Couldn't save AI response in DB. ${error}`)
  }
}