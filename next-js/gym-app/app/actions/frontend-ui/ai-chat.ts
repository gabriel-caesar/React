'use client';

import { Conversation, Message, User } from '@/app/lib/definitions';
import { Dispatch, FormEvent, SetStateAction } from 'react';
import { v4 as uuidv4 } from 'uuid';

// creates the user chat bubble dynamically
export function createChatBubble (
  prompt: string | null,
  setPrompt: Dispatch<SetStateAction<string>> | null,
  setLocalMessages: Dispatch<SetStateAction<Message[]>>,
  localMessages: Message[],
  conversationId: string,
  sentDate: string,
  isUser: boolean
):Message {
  setPrompt?.('');
  const uuid = uuidv4();

  const newMessageObj = {
    message_content: prompt as string,
    role: isUser ? ('user' as 'user') : ('ai' as 'ai'),
    sent_date: sentDate,
    id: uuid,
    conversation_id: conversationId,
  };

  setLocalMessages((prev) => [...prev, newMessageObj]);

  return newMessageObj;
}

export async function submitPrompt(
  e: FormEvent,
  setLocalMessages: Dispatch<SetStateAction<Message[]>>,
  setIsAIWriting: Dispatch<SetStateAction<boolean>>,
  setResponse: Dispatch<SetStateAction<string>>,
  setPrompt: Dispatch<SetStateAction<string>>,
  conversation: Conversation | null,
  localMessages: Message[],
  response: string | null,
  prompt: string,
  user: User | undefined
) {
  e.preventDefault();

  // don't submit if input is empty
  if (prompt.length === 0) return;

  const date: string = new Date().toISOString();

  setIsAIWriting(true); // blocking user to send more messages

  setResponse('...'); // thinking feedback

  // conversation id is available based on if props conversation exists
  const conversationId = conversation ? (conversation as Conversation).id : '';

  const userChatBubble = createChatBubble(
    prompt ? prompt : '',
    setPrompt,
    setLocalMessages,
    localMessages,
    conversationId,
    date,
    true
  ); // creates the user bubble chat

  const aiChatBubble = createChatBubble(
    '',
    setPrompt,
    setLocalMessages,
    localMessages,
    conversationId,
    date,
    false
  ); // creates the ai bubble chat

  try {
    // save messages on DB
    // fetch the conversation data and send to the api call
    // fetching the chat API to return the AI response
    const call = await fetch(`/api/chat/${conversationId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: prompt,
        user: user,
        conversation: conversation,
        date: date,
      }),
    });

    // reading the stream from the API call
    const stream = call.body?.getReader();
    if (!stream) {
      throw new Error('No stream from server');
    }

    // UTF-8 decoder
    const decoder = new TextDecoder();

    // this cleans the (...) before inserting the response
    setResponse('');

    // response to send back to API and save it to DB as role === 'ai'
    let fullResponse: string = '';

    // while stream is not fully read
    while (true) {
      const { done, value } = await stream.read();
      if (done) break;

      const text = decoder.decode(value, { stream: true }); // decoding the strings from the stream while done is false

      setResponse((prev) => (prev += text)); // appending the text with the streaming effect
      fullResponse += text; // response to be bounced back to the API call
    }

    // this call will bounce back the AI response to be saved on the DB
    // since we can't save the streaming state of the AI response
    // we await it to be fully streamed to then send it back to the DB
    // send to save-ai-message API to query for data in the db
    if (fullResponse !== '') {
      aiChatBubble.message_content = fullResponse;
      const call = await fetch(`/api/chat/save-ai-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aiChatBubble: aiChatBubble,
          userChatBubble: userChatBubble,
          existingConversation: conversation,
        }),
      });

      const data = await call.json();
      // that means no conversation was created, so cease the function
      if (data.message) return;

      return data.redirectTo;
    }
  } catch (error) {
    throw new Error(`Couldn't process AI response. ${error}`);
  } finally {
    setIsAIWriting(false);
  }
}
