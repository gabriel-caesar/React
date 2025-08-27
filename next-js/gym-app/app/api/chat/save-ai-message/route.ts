'use server'

import { Conversation, Message } from '@/app/lib/definitions';
import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function POST(req: Request) {
  
  const { response, date, prompt } = await req.json();

  const conversation = await sql<Conversation[]>`
    SELECT * FROM conversations
    WHERE id = (SELECT conversation_id FROM messages WHERE message_content = ${prompt} AND sent_date = ${date});
  `

  // saves the AI response in the db
  try {
    // if response is not empty and conversation exists
    if (response !== null && conversation.length > 0) {
        console.log(`Executed try block and response was not null!\n`)
        // saving AI response on the bounce back after the
        // response stream is finished

        if (conversation) {
          const insertedResponse = await sql<Message[]>`
            INSERT INTO messages
            (message_content, conversation_id, role)
            VALUES (${response}, ${conversation[0].id}, 'ai')
            RETURNING *;
          `;
          console.log(`\n----# From "save-ai-message" #-----\n`)
          console.log(`\n1. Inserted message "${response}" from AI in conversation "${conversation[0].title}"\n`)
      
          // update the last message sent from this conversation
          await sql`
            UPDATE conversations
            SET last_message_date = ${insertedResponse[0].sent_date}
            where id = ${conversation[0].id}
          `;
          console.log(`\n2. Updated the last_message_date column from the current conversation "${conversation[0].title}".\n`)
  
        }

        // returning the redirect address to submitPrompt()
        return NextResponse.json({ redirectTo: `${conversation[0].id}` });
      }

      return NextResponse.json({ message: 'No conversation created' });
  } catch (error) {
    throw new Error(`Couldn't save AI response in DB. ${error}`)
  }
}