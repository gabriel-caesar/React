'use client';

import {
  useEffect,
  useRef,
  useContext,
  useLayoutEffect,
} from 'react';
import { aiChatContext } from './chat-structure';
import { usePathname } from 'next/navigation';
import styles from '@/app/css/dashboard.module.css';
import Markdown from 'react-markdown'
import InputForm from './input-form';

export default function Panel() {
  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  // context from chat-structure.tsx
  const { response, localMessages, setLocalMessages, chatPanelRef, user } = useAIChatContext();

  // greeting paragraph ref to avoid clearing the chat bubble
  const greetingParagrah = useRef<HTMLParagraphElement | null>(null);
  // used to know where the URL current is point to
  const pathname = usePathname();

  // markdown styles
  const proseStlyes = `
    prose prose-p:text-white prose-headings:text-red-500 
    prose-li:text-white prose-strong:text-red-500 
    prose-code:text-blue-400  prose-a:text-blue-400
    prose-blockquote:bg-slate-700 prose-blockquote:w-fit
    prose-blockquote:rounded-tr-md prose-blockquote:pr-6
    prose-blockquote:text-neutral-400 prose-blockquote:rounded-br-md
    marker:text-blue-500
  `

  // feeding the last text bubble with the most up to date response
  // and scrolling down every time the scroll height updates
  useEffect(() => {
    const chat = chatPanelRef.current;
    const lastAIChatBubble = localMessages[localMessages.length - 1];
    const updatedLocalMessages = localMessages.map(bubble => {
      if (bubble.id === lastAIChatBubble.id) {
        return {
          ...bubble,
          message_content: response
        }
      }
      return bubble;
    })
    setLocalMessages(updatedLocalMessages);
    chat!.scrollTop = chat!.scrollHeight;
  }, [response])

  useLayoutEffect(() => {
    if (chatPanelRef.current) {
      chatPanelRef.current!.scrollTop = chatPanelRef.current!.scrollHeight;
    }
  }, [pathname]);

  return (
    <div
      ref={chatPanelRef}
      aria-label='chat-panel'
      data-testid='chat-panel'
      id='chat-panel'
      className={`
        ${styles.scrollbar_chat} 
        pb-20 pt-20 md:w-11/12 z-1 mb-4 relative
        w-full px-2 h-screen overflow-y-auto overflow-x-hidden
      `}
    >
      <div 
        id='input-form-wrapper' 
        className='fixed w-11/12 md:w-11/13 bottom-2 left-1/2 -translate-x-1/2 z-2'
      >
        <InputForm />
      </div>
      <p
        aria-label='ai-chat-bubble'
        className='text-md bg-[linear-gradient(45deg,#525252_50%,#656565)] border-1 border-neutral-400 rounded-md p-2 text-start w-fit max-w-full h-fit overflow-auto'
        id='greeting-ai-chat-bubble'
        data-testid='greeting-ai-chat-bubble'
        ref={greetingParagrah}
      >
        Hello <strong className='text-red-400'>{user?.firstname}</strong>, to get started you can tell me what are your fitness goals and I will help you achieve it, but that needs to be essentially something related to either workout or a diet.
      </p>
      {localMessages.length > 0 && (
        localMessages.map(bubble => {
          return (
            <div
              className={`
                ${bubble.role === 'ai' ? 'justify-start' : 'justify-end'}
                flex items-center w-full my-6
              `}
              aria-label={bubble.role === 'ai' ? 'ai-chat-bubble' : 'user-chat-bubble'}
              data-testid={bubble.role === 'ai' ? 'ai-chat-bubble' : 'user-chat-bubble'}
              id={bubble.role === 'ai' ? 'ai-chat-bubble' : 'user-chat-bubble'}
              key={bubble.id}
            >
              <div className={`
                ${proseStlyes}
                ${bubble.role === 'ai' ? 'bg-[linear-gradient(45deg,#525252_50%,#737373)] border-1 border-neutral-400' : 'bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-1 border-red-300'}
                rounded-md p-2 text-md text-start w-fit max-w-full 
                md:max-w-3/4 h-fit overflow-auto break-normal
              `}>
                <Markdown>
                  {bubble.message_content}
                </Markdown>
              </div>
            </div>
          )
        })
      )}
    </div>
  );
}
