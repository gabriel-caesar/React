'use client';

import {
  useEffect,
  useState,
  useRef,
  useContext,
  useLayoutEffect,
} from 'react';
import { aiChatContext } from './chat-structure';
import styles from '@/app/css/dashboard.module.css';
import {
  createAIChatBubble,
  createUserChatBubble,
} from '@/app/actions/frontend-ui/ai-chat';
import { usePathname } from 'next/navigation';
import { Button } from './button';

export default function Panel({
  hasDiet,
  hasWorkout,
}: {
  hasDiet: boolean | undefined;
  hasWorkout: boolean | undefined;
}) {
  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  // context from chat-structure.tsx
  const { response, chatPanelRef, user, messages } = useAIChatContext();

  // greeting paragraph ref to avoid clearing the chat bubble
  const greetingParagrah = useRef<HTMLParagraphElement | null>(null);
  // chat panel margin state to add responsiveness when the height changes
  const [chatPanelMargin, setChatPanelMargin] = useState<number>(50);
  // used to know where the URL current is point to
  const pathname = usePathname();

  // feeding the last text bubble with the most up to date response
  // and scrolling down every time the scroll height updates
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const chat = chatPanelRef.current;
    const lastChatBubble = chat?.lastElementChild;
    // preventing the first greeting ai chat bubble to be erased
    if (
      lastChatBubble?.ariaLabel === 'ai-chat-bubble' &&
      lastChatBubble.id !== greetingParagrah.current?.id
    ) {
      lastChatBubble.textContent = response;
      chat!.scrollTop = chat!.scrollHeight;
    }
  }, [response]);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (chatPanelRef.current) {
      chatPanelRef.current!.scrollTop = chatPanelRef.current!.scrollHeight;
    }
    console.log(
      `scrollTop: ${chatPanelRef.current!.scrollTop}\nscrollHeight: ${chatPanelRef.current!.scrollHeight}`
    );
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

  // this effect hook will look for changes of conversation tabs
  // and create a chat bubble for every message coming from the db
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // clearing the chat panel before appending messages to it
    if (messages.length > 0) chatPanelRef.current!.innerHTML = '';
    
    messages.forEach((msg) => {
      if (msg.role === 'user') {
        createUserChatBubble(null, null, chatPanelRef, msg.message_content);
      }

      if (msg.role === 'ai') {
        createAIChatBubble(chatPanelRef, msg.message_content);
      }
    });
  }, []);

  return (
    <div
      ref={chatPanelRef}
      aria-label='chat-panel'
      id='chat-panel'
      style={{
        marginTop: chatPanelMargin + 'px',
      }}
      className={`
            [@media(max-height:300px)]:border-t-0
            max-[1024px]:h-screen max-[1024px]:w-full max-[1024px]:border-t-1 max-[1024px]:border-neutral-400
            w-4/5 h-3/4 p-10 overflow-y-auto overflow-x-hidden ${styles.scrollbar_chat}
          `}
    >
      <p
        aria-label='ai-chat-bubble'
        className='text-md bg-neutral-600 rounded-md p-2 text-start w-fit max-w-full h-fit overflow-auto'
        id='greeting-ai-chat-bubble'
        ref={greetingParagrah}
      >
        {!hasDiet && !hasWorkout
          ? `Hello ${user?.firstname}, what plan are we working on today? Workout or Diet?`
          : !hasDiet && hasWorkout
            ? `Saw that you already created one wokout plan, congrats! Now let's create your diet plan.`
            : hasDiet && !hasWorkout
              ? `Saw that you already created one diet plan, congrats! Now let's move on to your workout plan!`
              : `Hello ${user?.firstname}, what can I help you with today?`}
      </p>
      <div
        aria-label='plans-selection-container'
        className='bg-neutral-600 rounded-md p-2 w-fit mt-6'
      >
        <p className='mb-2'>Choose one of the following to get started:</p>
        {!hasDiet && !hasWorkout && (
          <div className='flex justify-center items-center'>
            <Button text='Workout' className='mr-2' />
            <Button text='Diet' className='' />
          </div>
        )}
      </div>
    </div>
  );
}
