'use client';

import { createContext, useState, useRef, useEffect } from 'react';
import Panel from './panel';
import {
  aiChatContextType,
  Conversation,
  Message,
  User,
} from '@/app/lib/definitions';
import TopBar from './top-bar';

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
  // local messages copy
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  // values object for the chat context
  const values = {
    response,
    setResponse,
    localMessages,
    setLocalMessages,
    chatPanelRef,
    user,
    conversation,
    messages,
  };

  // updating the local messages array with the db array of messages
  useEffect(() => setLocalMessages(messages), [messages]);

  return (
    <aiChatContext.Provider value={values}>
      <div className='flex flex-col justify-center items-center'>
        <TopBar />
        <Panel />
      </div>
    </aiChatContext.Provider>
  );
}
