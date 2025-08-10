'use client';

import { User } from '@/app/lib/definitions';
import { ArrowUp } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import styles from '../../css/dashboard.module.css';

export default function AIChat({ user }: { user: User | undefined }) {
  const [prompt, setPrompt] = useState<string>(''); // user's prompt
  const [response, setResponse] = useState<string>(`Hello ${user?.firstname}, how can I help you?`); // AI's response
  const chatPanelRef = useRef<HTMLDivElement | null>(null); // ref variable for the chat panel div element

  // creates the user chat bubble dynamically
  function createUserChatBubble() {

    setPrompt(''); // clearing user input before inserting a new response into the new text bubble

    if (chatPanelRef.current) {
      // wrapper to maintain the user messages on the right part of the chat panel
      const bubbleWrapper = document.createElement('div');
      const bubbleChat = document.createElement('p');

      // styling the elements
      bubbleWrapper.className = `flex justify-end items-center w-full my-6 break-normal`
      bubbleChat.className = `flex p-2 bg-red-400 rounded-md w-fit max-w-3/4 break-all`
      bubbleChat.textContent = prompt;

      // appending the elements to the DOM
      bubbleWrapper.appendChild(bubbleChat);
      chatPanelRef.current.appendChild(bubbleWrapper);
    }
  }

  // creates the AI chat bubble dynamically
  function createAIChatBubble() {
    if (chatPanelRef.current) {
      const aiBubbleChat = document.createElement('p');

      aiBubbleChat.className = `text-md bg-neutral-600 rounded-md p-2 text-start w-fit max-w-3/4 h-fit overflow-auto`

      chatPanelRef.current.appendChild(aiBubbleChat);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // don't submit if input is empty
    if (prompt.length === 0) return;

    // thinking feedback
    setResponse('...');

    createUserChatBubble(); // creates the bubble chat 

    createAIChatBubble(); // creates the bubble chat 
    
    try {
      // fetching the chat API to return the AI reponse
      const call = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt }),
      });

      // reading the stream from the API call
      const stream = call.body?.getReader();
      if (!stream) {
        throw new Error("No stream from server");
      }

      // UTF-8 decoder
      const decoder = new TextDecoder();

      // this cleans the (...) before inserting the response
      setResponse(''); 

      // while stream is not fully read
      while (true) {
        const { done, value } = await stream.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true }); // decoding the strings from the stream while done is false
        
        setResponse(prev => prev += text); // appending the text with the streaming effect
      }

    } catch (error) {
      throw new Error(`Couldn't process AI response. ${error}`);
    }
  };

  // feeding the last text bubble with the most up to date response
  // and scrolling down every time the scroll height updates
  useEffect(() => {
    const chat = chatPanelRef.current;
    const lastChatBubble = chat?.lastElementChild;
    if (lastChatBubble) {
      lastChatBubble.textContent = response;
      chat!.scrollTop = chat!.scrollHeight;
    };
  }, [response])

  return (
    <>
      <div
        ref={chatPanelRef}
        id='chat-panel'
        className={`mb-6 w-3/4 h-3/4 p-10 rounded-md overflow-y-auto overflow-x-hidden ${styles.scrollbar_chat} ${styles.inset_shadow}`}
      >
        <p className='text-md bg-neutral-600 rounded-md p-2 text-start w-fit max-w-full h-fit overflow-auto'>
          {`Hello ${user?.firstname}, how can I help you?`}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`flex items-center justify-center w-3/4 rounded-lg bg-neutral-600 relative ${styles.regular_shadow}`}
      >
        <textarea
          className={`${styles.scrollbar_textarea} bg-transparent focus-within:outline-none p-5 w-11/12 resize-none transition-all duration-300`}
          placeholder='Enter your message...'
          value={prompt}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setPrompt(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
            e.stopPropagation(); // stops textarea to jump a paragraph when hitting 'Enter'
            // checking if the shift key is pressed so it doesn't add a new line
            if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
          }}
        ></textarea>
        <span className='mx-3'>
          <button
            className={`rounded-full bg-neutral-900 w-15 h-15 flex items-center justify-center hover:cursor-pointer hover:text-red-500 transition-all duration-300 ${styles.red_shadow}`}
          >
            <ArrowUp />
          </button>
        </span>
      </form>
    </>
  );
}
