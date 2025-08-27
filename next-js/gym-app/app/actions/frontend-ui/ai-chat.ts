'use client'

import { Conversation, User } from '@/app/lib/definitions';
import { Dispatch, FormEvent, RefObject, SetStateAction } from 'react';

// creates the user chat bubble dynamically
export function createUserChatBubble(
  prompt: string | null,
  setPrompt: Dispatch<SetStateAction<string>> | null,
  chatPanelRef: RefObject<HTMLDivElement | null>,
  messageContent: string | null
) {
  setPrompt?.('');

  if (chatPanelRef.current) {
    // wrapper to maintain the user messages on the right part of the chat panel
    const bubbleWrapper = document.createElement('div');
    const bubbleChat = document.createElement('p');

    // styling the elements
    bubbleWrapper.className = `flex justify-end items-center w-full my-6 break-normal`;
    bubbleChat.className = `flex p-2 bg-red-400 rounded-md w-fit max-w-3/4 break-normal`;
    bubbleChat.ariaLabel = 'user-chat-bubble';
    bubbleChat.textContent = prompt === null ? messageContent : prompt;

    // appending the elements to the DOM
    bubbleWrapper.appendChild(bubbleChat);
    chatPanelRef.current.appendChild(bubbleWrapper);
  }
}

// creates the AI chat bubble dynamically
export function createAIChatBubble(
  chatPanelRef: RefObject<HTMLDivElement | null>,
  messageContent: string | null
) {
  if (chatPanelRef.current) {
    const aiBubbleChat = document.createElement('p');

    aiBubbleChat.className = `text-md bg-neutral-600 rounded-md p-2 text-start w-fit max-w-3/4 h-fit overflow-auto break-normal`;

    aiBubbleChat.ariaLabel = 'ai-chat-bubble';

    // if there is message content coming from the function call, assign it to the element
    if (messageContent) aiBubbleChat.textContent = messageContent;

    chatPanelRef.current.appendChild(aiBubbleChat);
  }
}

export async function submitPrompt(
  e: FormEvent,
  setIsAIWriting: Dispatch<SetStateAction<boolean>>,
  setResponse: Dispatch<SetStateAction<string>>,
  response: string | null,
  chatPanelRef: RefObject<HTMLDivElement | null>,
  prompt: string,
  setPrompt: Dispatch<SetStateAction<string>>,
  user: User | undefined,
  conversation: Conversation | null
) {
  e.preventDefault();

  // don't submit if input is empty
  if (prompt.length === 0) return;

  const date: string = new Date().toISOString();

  setIsAIWriting(true); // blocking user to send more messages

  setResponse('...'); // thinking feedback

  createUserChatBubble(prompt, setPrompt, chatPanelRef, null); // creates the user bubble chat

  createAIChatBubble(chatPanelRef, null); // creates the AI bubble chat

  // conversation id is available based on if props conversation exists
  const conversationId =
    conversation ? (conversation as Conversation).id : '';

  try {
    // save messages on DB
    // fetch the conversation data and send to the api call

    // fetching the chat API to return the AI reponse
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
    console.log(`\nLogging from ai-chat.ts...`)
    // send to save-ai-message API to query for data in the db
    
    console.log(`\nfullResponse: ${fullResponse}\ndate = ${date}\n`)
    if (fullResponse !== '') {
      console.log(`\nFetching the save-ai-message API\n`)
      const call = await fetch(`/api/chat/save-ai-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response: fullResponse,
          date: date,
          prompt: prompt
        }),
      });

      const data = await call.json();
      // that means no conversation was created, so cease the function
      if (data.message) return

      return data.redirectTo;
      
    }
  } catch (error) {
    throw new Error(`Couldn't process AI response. ${error}`);
  } finally {
    setIsAIWriting(false);
  }
}
