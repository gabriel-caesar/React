'use client';

import { createContext, useState, useRef } from 'react';
import InputForm from './input-form';
import Panel from './panel';
import {
  aiChatContextType,
  Conversation,
  Message,
  User,
} from '@/app/lib/definitions';

export const aiChatContext = createContext<aiChatContextType | null>(null);

export default function ChatStructure({
  user,
  conversation,
  messages,
}: {
  user: User | undefined;
  conversation: Conversation | null;
  messages: Message[] | [];
}) {
  // AI's response
  const [response, setResponse] = useState<string>('');
  // ref variable for the chat panel div element
  const chatPanelRef = useRef<HTMLDivElement | null>(null);
  // values object for the chat context
  const values = {
    response,
    setResponse,
    chatPanelRef,
    user,
    conversation,
    messages
  };

  return (
    <aiChatContext.Provider value={values}>
      <h1
        aria-label='conversation-title'
        id='conversation-title'
        className='
        min-[1024px]:border-b-2 min-[1024px]:border-white
        max-[1024px]:text-lg max-[1024px]:top-2.5 
        absolute right-3 top-3 text-2xl p-1 rounded-md
        '
      >
        {conversation?.title ? conversation?.title : 'Welcome'}
      </h1>
      <Panel />
      <InputForm />
    </aiChatContext.Provider>
  );
}
