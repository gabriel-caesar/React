'use client';

import { LucideLoaderPinwheel } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { submitPrompt } from '@/app/actions/frontend-ui/ai-chat';
import { aiChatContext } from './chat-structure';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FaArrowUp, FaClipboardList } from 'react-icons/fa';
import animations from '../../../css/animations.module.css';
import styles from '@/app/css/dashboard.module.css';
import {
  dietFormDataType,
  dietFormRawData,
} from '@/public/plan_metadata/diet-formdata';
import {
  workoutFormDataType,
  workoutFormRawData,
} from '@/public/plan_metadata/workout-formdata';

export default function InputForm() {
  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  // context from chat-structure.tsx
  const {
    setResponse,
    setLocalMessages,
    localMessages,
    user,
    conversation,
    isSuggest,
    setIsSuggest,
    dietFormData,
    generatingPlan,
    isAIWriting,
    setIsAIWriting,
    setDietFormData,
    planType,
    setWorkoutFormData,
    workoutFormData,
  } = useAIChatContext();
  const [submitPromptData, setSubmitPromptData] = useState<{
    url: string;
  }>({ url: '' });
  // user prompt tracked every keystroke
  const [prompt, setPrompt] = useState<string>('');
  // router to redirect user
  const router = useRouter();
  // params getter
  const searchParams = useSearchParams();
  // to read the current URL
  const pathname = usePathname();

  // redirect the user to the conversation if its not there already
  useEffect(() => {
    // ensures the submitPromptData is not empty before redirecting the user
    const { url } = submitPromptData;
    const urlArray = pathname.split('/');
    const conversationId = urlArray[urlArray.length - 1];
    // if url is not existent
    // or the existent conversation id equals the url being sent, return
    if (!url || url === conversationId) return; 

    // if at the current moment the submitPromptData is not
    // equal than the conversation id, redirect the user
    if (!urlArray.find((el) => el === url)) {
      router.push(`/dashboard/${url}?suggest=true`);
    }
  }, [submitPromptData]);

  // executes as soon as dietFormData becomes a plain stringified JSON version of the plan
  useEffect(() => {
    async function executeSubmission(
      formData: dietFormDataType | workoutFormDataType
    ) {
      const data = await submitPrompt(
        localMessages,
        setLocalMessages,
        setIsAIWriting,
        setResponse,
        setPrompt,
        setIsSuggest,
        conversation,
        'Generate the plan.',
        user,
        formData
      );
      setSubmitPromptData(data ? data : '');
    }
    // assigning the submission condition accordingly
    // if one of these two keys are different than an empty string, it means the AI filled the form
    const submissionCondition =
      planType === 'diet'
        ? (dietFormData as dietFormDataType).meals[0].meal_name !== ''
        : (workoutFormData as workoutFormDataType).daily_workouts[0]
            .workout_name !== '';
    if (!generatingPlan && submissionCondition) {
      executeSubmission(
        planType === 'diet'
          ? (dietFormData as dietFormDataType)
          : (workoutFormData as workoutFormDataType)
      );
    }
  }, [generatingPlan]);

  useEffect(() => {
    // when AI stops writing, check if the dietFormData/workoutFormData state is filled, if so "clear it"
    if (
      !isAIWriting &&
      ((dietFormData as dietFormDataType).meals[0].meal_name !== '' ||
        (workoutFormData as workoutFormDataType).daily_workouts[0].exercises[0]
          .exercise_name !== '')
    ) {
      setDietFormData(dietFormRawData);
      setWorkoutFormData(workoutFormRawData);
    }
  }, [isAIWriting]);

  useEffect(() => {
    // getting the suggest flag when moving to a brand new conversation page
    const suggestParams = searchParams.get('suggest');
    if (suggestParams) setIsSuggest(true);
    // since isSuggest initial value is false, this line will remove the params but at the same time pop the form up
    if (!isSuggest)
      router.replace(`/dashboard/${conversation ? conversation.id : ''}`);
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const data = await submitPrompt(
          localMessages,
          setLocalMessages,
          setIsAIWriting,
          setResponse,
          setPrompt,
          setIsSuggest,
          conversation,
          prompt,
          user
        );

        setSubmitPromptData(data ? data : '');
      }}
      className={`
        flex items-center justify-center w-full rounded-lg backdrop-blur-2xl relative transition-all duration-300
        border-1 border-neutral-400 ${isSuggest ? 'bg-[linear-gradient(45deg,#8a8888_50%,#e8e8e8)]' : 'bg-transparent'}
        ${styles.regular_shadow}
      `}
      data-testid='input-form-test-id'
    >
      <span className='mx-2 md:mx-4'>
        <button
          disabled={generatingPlan}
          id='form-button'
          aria-label='form-button'
          data-testid='form-button'
          type='button'
          className={`
            ${styles.red_shadow}
            hover:cursor-pointer hover:text-red-500
            p-3 text-lg text-center flex justify-center items-center
            rounded-full transition-all duration-300 border-1 
            ${
              isSuggest
                ? 'bg-[linear-gradient(45deg,#000_50%,#606060)] border-neutral-500 text-neutral-200'
                : 'bg-[linear-gradient(45deg,#c9c9c9_50%,#e8e8e8)] border-neutral-100 text-black'
            }
          `}
          onClick={() => (!generatingPlan ? setIsSuggest(!isSuggest) : {})}
        >
          <FaClipboardList />
        </button>
      </span>
      <textarea
        className={`${styles.scrollbar_textarea} bg-transparent focus-within:outline-none p-5 w-11/12 resize-none transition-all duration-300`}
        placeholder='Enter your message...'
        aria-label='user-input-field'
        data-testid='user-input-field'
        value={prompt}
        disabled={generatingPlan}
        onClick={() => isSuggest && setIsSuggest(false)}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setPrompt(e.target.value)
        }
        onKeyDown={async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          const isMobile = window.innerWidth <= 768; // checking viewport view for mobile users
          const isInputEmpty = prompt.trim() === ''; // if input is not a bunch of whitespaces
          if (!isMobile && e.key === 'Enter' && !e.shiftKey) e.preventDefault(); // don't add a new line if its not mobile
          if (
            e.key === 'Enter' &&
            !e.shiftKey &&
            !isMobile &&
            !isAIWriting &&
            !isInputEmpty
          ) {
            const data = await submitPrompt(
              localMessages,
              setLocalMessages,
              setIsAIWriting,
              setResponse,
              setPrompt,
              setIsSuggest,
              conversation,
              prompt,
              user
            );

            setSubmitPromptData(data ? data : '');
          }
        }}
      ></textarea>
      <span className='mx-2 md:mx-4'>
        <button
          aria-label='send-message-button'
          data-testid='send-message-button'
          disabled={generatingPlan}
          className={`
            ${styles.red_shadow}
            ${
              isAIWriting
                ? `bg-white ${animations.loading} text-black p-2`
                : 'bg-[linear-gradient(45deg,#000_50%,#606060)] border-neutral-500 p-3'
            }
            rounded-full text-lg border-1 flex items-center justify-center hover:cursor-pointer hover:text-red-500 transition-all duration-300
          `}
        >
          {isAIWriting ? (
            <LucideLoaderPinwheel data-testid='sending-prompt-icon' />
          ) : (
            <FaArrowUp data-testid='send-prompt-icon' />
          )}
        </button>
      </span>
    </form>
  );
}
