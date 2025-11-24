import { useContext } from 'react';
import { aiChatContext } from './chat-structure';
import { Orbitron } from 'next/font/google';

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function TopBar() {
  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  // context from chat-structure.tsx
  const { conversation } = useAIChatContext();

  return (
    <div
      id='top-panel-bar'
      aria-label='top-panel-bar'
      className='w-full bg-[linear-gradient(45deg,#262626_50%,#353535)] border-b-1 border-neutral-600 flex justify-end items-center fixed top-0 left-0 z-2 py-1 px-3'
    >
      <h1
        aria-label='conversation-title'
        data-testid='conversation-title'
        id='conversation-title'
        style={{ letterSpacing: '0.1rem' }}
        className={`
          ${orbitron.className}
          text-lg lg:text-2xl
          max-[1024px]:top-2.5 p-1 rounded-md
        `}
      >
        <p className='block md:hidden'>
          {conversation?.title
            ? conversation?.title.length >= 13
              ? conversation?.title.slice(0, 13) + '...'
              : conversation?.title
            : 'Welcome'}
        </p>

        <p className='hidden md:block'>
          {conversation?.title ? conversation?.title : 'Welcome'}
        </p>
      </h1>
    </div>
  );
}
