'use client';

import { useEffect, useRef, useContext, useLayoutEffect, useState } from 'react';
import { CiSaveDown2, CiCircleCheck, CiFileOn } from 'react-icons/ci';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { workoutFormDataType, workoutFormRawData } from '@/public/plan_metadata/workout-formdata';
import { dietFormDataType, dietFormRawData } from '@/public/plan_metadata/diet-formdata';
import { aiChatContext } from './chat-structure';
import { usePathname, useRouter } from 'next/navigation';
import remarkGfm from 'remark-gfm';
import InputForm from './input-form';
import Markdown from 'react-markdown';
import animations from '@/app/css/animations.module.css';
import styles from '@/app/css/dashboard.module.css';
import { Orbitron } from 'next/font/google';
import { motion } from 'framer-motion';
import { v4 } from 'uuid';

const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function Panel() {
  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  // context from chat-structure.tsx
  const {
    response,
    localMessages,
    setLocalMessages,
    chatPanelRef,
    user,
    isAIWriting,
    setSavingPlan,
    savingPlan,
    setDietFormData,
    setWorkoutFormData
  } = useAIChatContext();

  const diversusIntroTexts = [
    `Welcome to Diversus, ${user?.firstname}. I await your command. Tell me what you seek, and I will shape the path to reach it.`,
    `You've entered Diversus, where your goals become my directives. Speak your intent, ${user?.firstname}, and I will craft the way forward.`,
    `This is Diversus, ${user?.firstname} built to serve your ambition. State your purpose, and I will assemble the routine to match it.`,
    `At Diversus, your will is the blueprint. Declare your objective, ${user?.firstname}, and I will forge the plan that fulfills it.`
  ]
  const [randomIntroIndex, setRandomIntroIndex] = useState<number>(0);
  const [diversusIntro] = useState<string>(diversusIntroTexts[randomIntroIndex]);
  // greeting paragraph ref to avoid clearing the chat bubble
  const greetingParagrah = useRef<HTMLParagraphElement | null>(null);
  // used to know where the URL current is point to
  const pathname = usePathname();
  const router = useRouter();

  // markdown styles
  const proseStyles = `
    prose prose-p:text-white prose-headings:text-white 
    prose-li:text-white prose-strong:text-white 
    prose-code:text-blue-400  prose-a:text-blue-400
    prose-blockquote:bg-slate-700 prose-blockquote:w-fit
    prose-blockquote:rounded-tr-md prose-blockquote:pr-6
    prose-blockquote:text-neutral-400 prose-blockquote:rounded-br-md
    marker:text-red-400 prose-th:text-white prose-td:text-white
  `;

  // handles saving the plan
  async function handleSavePlan(formData: dietFormDataType | workoutFormDataType, messageId: string) {
    setSavingPlan(true);
    try {
      const userId = user ? user.id : '';
      await fetch(`/api/plans/save-plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formData: formData,
          isDiet: formData.plan_type === 'diet' ? true : false,
          userId: userId,
          messageId: messageId,
        }),
      });
      // updating saved_plan locally
      const updatedLocalMessages = localMessages.map((msg) =>
        msg.id === messageId ? { ...msg, plan_saved: true } : msg
      );
      setLocalMessages(updatedLocalMessages);
    } catch (error) {
      throw new Error(`Couldn't save plan from front-end. ${error}`);
    } finally {
      setSavingPlan(false);
      // reseting the form datas prevent duplicate ids if creating plans in a row
      dietFormRawData.id = v4();
      workoutFormRawData.id = v4();
      setDietFormData(dietFormRawData);
      setWorkoutFormData(workoutFormRawData);
    }
  }

  function handleViewPlan(id: string) {
    router.replace(`/dashboard/plans/${id}`);
  }

  // feeding the last text bubble with the most up to date response
  // and scrolling down every time the scroll height updates
  useEffect(() => {
    const chat = chatPanelRef.current;
    const lastAIChatBubble = localMessages[localMessages.length - 1];
    const updatedLocalMessages = localMessages.map((bubble) => {
      if (bubble.id === lastAIChatBubble.id) {
        return {
          ...bubble,
          message_content: response,
        };
      }
      return bubble;
    });
    setLocalMessages(updatedLocalMessages);
    chat!.scrollTop = chat!.scrollHeight;
  }, [response]);

  useLayoutEffect(() => {
    if (chatPanelRef.current) {
      chatPanelRef.current!.scrollTop = chatPanelRef.current!.scrollHeight;
    }
  }, [pathname]);

  // generates a random intro index every mount
  useEffect(() => setRandomIntroIndex(Math.floor(Math.random() * 4)), [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
      ref={chatPanelRef}
      aria-label='chat-panel'
      data-testid='chat-panel'
      id='chat-panel'
      className={`
        ${styles.scrollbar_chat} 
        pb-30 pt-20 z-1 mb-4 relative
        w-full lg:w-[900px] lg:px-10 px-2 h-screen overflow-y-auto overflow-x-hidden
      `}
    >
      <div
        className='fixed w-13/14 lg:w-[865px] bottom-2 left-1/2 -translate-x-1/2 z-2'
      >
        <InputForm />
      </div>
      
      <p
        aria-label='ai-chat-bubble-intro'
        className={`${orbitron.className} text-center text-lg p-2 pb-4 border-b-1 text-neutral-300 w-fit max-w-full h-fit overflow-auto`}
        style={{ letterSpacing: '0.1rem' }}
        id='greeting-ai-chat-bubble'
        data-testid='greeting-ai-chat-bubble'
        ref={greetingParagrah}
      >
        {diversusIntro}
      </p>
      {localMessages.length > 0 &&
        localMessages.map((bubble) => {
          return (
            <div
              className={`
                ${bubble.role === 'assistant' ? 'justify-start items-start' : 'justify-end items-end'}
                flex flex-col w-full my-6
              `}
              aria-label={
                bubble.role === 'assistant'
                  ? 'ai-chat-bubble'
                  : 'user-chat-bubble'
              }
              data-testid={
                bubble.role === 'assistant'
                  ? 'ai-chat-bubble'
                  : 'user-chat-bubble'
              }
              id={
                bubble.role === 'assistant'
                  ? 'ai-chat-bubble'
                  : 'user-chat-bubble'
              }
              key={bubble.id}
            >
              <div
                className={`
                ${proseStyles}
                ${bubble.role === 'assistant' ? 'bg-[linear-gradient(45deg,#525252_50%,#737373)] border-1 border-neutral-400' : 'bg-[linear-gradient(45deg,#E63946_50%,#f06e78)] border-1 border-red-300'}
                rounded-md p-2 text-md text-start w-fit max-w-full
                md:max-w-3/4 h-fit overflow-auto break-normal
              `}
              >
                <Markdown remarkPlugins={[remarkGfm]}>
                  {bubble.message_content}
                </Markdown>
              </div>
              {bubble.form_data && !isAIWriting && (
                <div
                  id='tool-bar-container'
                  className='w-full md:max-w-3/4 flex items-end justify-end mt-2'
                >
                  {bubble.plan_saved && (
                    <button
                      id='view-plan-button'
                      aria-label='view-plan-button'
                      type='button'
                      className={`
                        text-4xl text-red-400 rounded-lg p-1 bg-transparent hover:bg-neutral-700 
                        hover:scale-105 active:scale-95 hover:cursor-pointer transition-all duration-300 group mr-2
                        ${!bubble.plan_saved && 'active:scale-95'}
                      `}
                      onClick={() => {
                        if (bubble.plan_saved && !savingPlan)
                          handleViewPlan(bubble.form_data ? bubble.form_data.id : '')
                      }}
                    >
                      <CiFileOn />
                      <div
                        id='view-plan-info'
                        aria-label='view-plan-info'
                        className='absolute text-white whitespace-nowrap -left-1 -bottom-6 bg-neutral-700 rounded-lg px-2 w-fit text-center text-sm hover:cursor-default pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 transition-all duration-300'
                      >
                        View plan
                      </div>
                    </button>
                  )}
                  <button
                    id='save-plan-button'
                    aria-label='save-plan-button'
                    type='button'
                    disabled={bubble.plan_saved}
                    className={`
                      text-4xl text-red-400 rounded-lg p-1 bg-transparent hover:bg-neutral-700 
                      hover:scale-105 hover:cursor-pointer transition-all duration-300 group
                      ${!bubble.plan_saved && 'active:scale-95'}
                    `}
                    onClick={() => {
                      if (!bubble.plan_saved && !savingPlan)
                        handleSavePlan(
                          bubble.form_data as dietFormDataType | workoutFormDataType,
                          bubble.id
                        );
                    }}
                  >
                    {bubble.plan_saved ? (
                      <CiCircleCheck />
                    ) : savingPlan ? (
                      <AiOutlineLoading3Quarters
                        className={`${animations.loading}`}
                      />
                    ) : (
                      <CiSaveDown2 />
                    )}
                    <div
                      id='save-plan-info'
                      aria-label='save-plan-info'
                      className='absolute text-white whitespace-nowrap -right-1 -bottom-6 bg-neutral-700 rounded-lg px-2 w-fit text-center text-sm hover:cursor-default pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 transition-all duration-300'
                    >
                      {savingPlan
                        ? 'Saving'
                        : bubble.plan_saved
                          ? 'Plan already saved'
                          : 'Save plan'}
                    </div>
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </motion.div>
  );
}
