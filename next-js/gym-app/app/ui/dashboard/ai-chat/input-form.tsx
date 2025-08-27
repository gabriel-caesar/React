'use client';

import { ArrowUp, X } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { submitPrompt } from '@/app/actions/frontend-ui/ai-chat';
import { aiChatContext } from './chat-structure';
import { usePathname, useRouter } from 'next/navigation';
import styles from '@/app/css/dashboard.module.css';

export default function InputForm() {
  const [endpoint, setEndpoint] = useState<string>('');

  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  // context from chat-structure.tsx
  const { response, setResponse, chatPanelRef, user, conversation } =
    useAIChatContext();
  // user's prompt
  const [prompt, setPrompt] = useState<string>('');
  // checking if AI is still writing text
  const [isAIWriting, setIsAIWriting] = useState<boolean>(false);
  // router to redirect user
  const router = useRouter();
  // to read the current URL
  const pathname = usePathname();

  // redirect the user to the conversation if its not there already
  useEffect(() => {
    // ensures the endpoint is not empty before redirecting the user
    if (!endpoint) return
    const urlArray = pathname.split('/');

    // if at the current moment the endpoint is not
    // equal than the conversation id, redirect the user
    if (urlArray[urlArray.length - 1] !== endpoint) {
      router.push(`/dashboard/${endpoint}`);
    }
    
  }, [endpoint, pathname, router]);

  return (
    <form
      onSubmit={async (e) => {
        const url = await submitPrompt(
          e,
          setIsAIWriting,
          setResponse,
          response,
          chatPanelRef,
          prompt,
          setPrompt,
          user,
          conversation
        );
        setEndpoint(url);
      }}
      className={`
            max-[1024px]:w-11/12
            flex items-center justify-center mb-2 w-3/4 rounded-lg bg-neutral-600 relative 
            ${styles.regular_shadow}
          `}
    >
      <textarea
        className={`${styles.scrollbar_textarea} bg-transparent focus-within:outline-none p-5 w-11/12 resize-none transition-all duration-300`}
        placeholder='Enter your message...'
        aria-label='user-input-field'
        value={prompt}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setPrompt(e.target.value)
        }
        onKeyDown={async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          const isMobile = window.innerWidth <= 768; // checking viewport view for mobile users
          const isInputEmpty = prompt.trim() === ''; // if input is not a bunch of whitespaces
          e.stopPropagation(); // stops textarea to jump a paragraph when hitting 'Enter'
          // checking if the shift key is pressed so it doesn't add a new line
          if (
            e.key === 'Enter' &&
            !e.shiftKey &&
            !isMobile &&
            !isAIWriting &&
            !isInputEmpty
          ) {
            const url = await submitPrompt(
              e,
              setIsAIWriting,
              setResponse,
              response,
              chatPanelRef,
              prompt,
              setPrompt,
              user,
              conversation
            );

            setEndpoint(url);
          }
        }}
      ></textarea>
      <span className='mx-3'>
        <button
          aria-label='send-message-button'
          className={`rounded-full w-15 h-15 flex items-center justify-center hover:cursor-pointer hover:text-red-500 transition-all duration-300 ${isAIWriting ? 'bg-white' : 'bg-neutral-900'} ${styles.red_shadow}`}
        >
          {isAIWriting ? (
            <X className='text-neutral-900' strokeWidth={2} size={30} />
          ) : (
            <ArrowUp size={28} />
          )}
        </button>
      </span>
    </form>
  );
}
