'use client';

import {
  useEffect,
  useState,
  useRef,
  useContext,
  useLayoutEffect,
} from 'react';
import { aiChatContext } from './chat-structure';
import { usePathname } from 'next/navigation';
import styles from '@/app/css/dashboard.module.css';
import Markdown from 'react-markdown'

export default function Panel() {
  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  // context from chat-structure.tsx
  const { response, localMessages, setLocalMessages, chatPanelRef, user, messages } = useAIChatContext();

  // greeting paragraph ref to avoid clearing the chat bubble
  const greetingParagrah = useRef<HTMLParagraphElement | null>(null);
  // chat panel margin state to add responsiveness when the height changes
  const [chatPanelMargin, setChatPanelMargin] = useState<number>(50);
  // used to know where the URL current is point to
  const pathname = usePathname();

  // markdown styles
  const proseStlyes = `
    prose prose-p:text-white prose-headings:text-red-400 
    prose-li:text-white prose-strong:text-blue-400 
    prose-code:text-blue-400  prose-a:text-blue-400
    prose-blockquote:bg-slate-700 prose-blockquote:w-fit
    prose-blockquote:rounded-tr-md prose-blockquote:pr-6
    prose-blockquote:text-neutral-400 prose-blockquote:rounded-br-md
    marker:text-blue-400
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (chatPanelRef.current) {
      chatPanelRef.current!.scrollTop = chatPanelRef.current!.scrollHeight;
    }
  }, [pathname]);

  // when the component mounts, we attach handleResize() onto
  // the window object so every resize interaction, the
  // function will fire and recalculate the margin for the chat panel
  useEffect(() => {
    function handleResize() {
      const chatHeight = window.innerHeight * 0.75; // h-3/4
      const factor = window.innerHeight <= 565 ? 0.15 : 0.1;
      setChatPanelMargin(chatHeight * factor);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      ref={chatPanelRef}
      aria-label='chat-panel'
      data-testid='chat-panel'
      id='chat-panel'
      style={{
        marginTop: chatPanelMargin + 'px',
      }}
      className={`
            [@media(max-height:300px)]:border-t-0
            max-[1024px]:h-screen max-[1024px]:w-full max-[1024px]:border-t-1 max-[1024px]:border-neutral-400
            w-4/5 h-3/4 p-10 overflow-y-auto overflow-x-hidden ${styles.scrollbar_chat} z-1
          `}
    >
      <p
        aria-label='ai-chat-bubble'
        className='text-md bg-neutral-600 rounded-md p-2 text-start w-fit max-w-full h-fit overflow-auto'
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
              id={bubble.role === 'ai' ? 'ai-chat-bubble' : 'user-chat-bubble'}
              key={bubble.id}
            >
              <div className={`
                ${proseStlyes}
                ${bubble.role === 'ai' ? 'bg-neutral-600' : 'bg-red-400'}
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
