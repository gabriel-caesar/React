'use client';

import { useContext } from 'react';
import { Orbitron } from 'next/font/google';
import { FaBowlFood, FaDumbbell } from "react-icons/fa6";
import { aiChatContext } from '../chat-structure';
import { IoMdClose } from "react-icons/io";

// nextjs font implementation to remove external network requests
const orbitron = Orbitron({
  weight: '400',
  subsets: ['latin'],
});

export default function GetStarted() {
  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  // context from chat-structure.tsx
  const { setIsSuggest, setPlanType, setDietFormData, setWorkoutFormData } = useAIChatContext();

  return (
    <div 
      id="plan-choices-container" 
      className='flex flex-col justify-center items-center relative'
    >
      <button 
        type='button'
        id="close-form-button"
        aria-label="close-form-button"
        className='top-1 right-1 text-lg absolute active:text-red-500 hover:brightness-50 hover:cursor-pointer transition-all'
        onClick={() => {
          setIsSuggest(false)
        }}
      >
        <IoMdClose />
      </button>
      <h3
        id='choose-a-plan-header'
        aria-label='choose-a-plan-header'
        className={`
          ${orbitron.className}
        `}
        style={{ letterSpacing: '0.1rem' }}
      >
        Choose a plan
      </h3>
      <p className='text-neutral-300 text-center text-sm my-3' id='info-text'>
        By choosing a plan you will be assisted and guided towards a fitness model 
        of a diet or workout plan of your choice and tailored with your needs
      </p>
      <div id="button-container" className='flex items-center justify-between px-2 w-full'>
        <button
          id='workout-plan-button'
          type='button'
          aria-label='workout-plan-button'
          className={`
            flex items-center justify-center text-lg text-neutral-200
            shadow-md mr-4 bg-[linear-gradient(45deg,#525252_50%,#737373)]
            rounded-lg px-2 border-1 border-neutral-500 w-full transition-all duration-200  
            hover:cursor-pointer hover:scale-105 hover:text-red-500 hover:border-red-500
          `}
          onClick={() => {
            setWorkoutFormData(prev => ({ ...prev, plan_type: 'workout' }));
            setPlanType('workout');
          }}
        >
          <FaDumbbell className='mr-2' />
          Workout
        </button>
        <button
          id='diet-plan-button'
          data-testid='diet-plan-button'
          type='button'
          aria-label='diet-plan-button'
          className={`
            flex items-center justify-center text-lg text-neutral-200
            shadow-md bg-[linear-gradient(45deg,#525252_50%,#737373)]
            rounded-lg px-2 border-1 border-neutral-500 w-full transition-all duration-200
            hover:cursor-pointer hover:scale-105 hover:text-red-500 hover:border-red-500   
          `}
          onClick={() => {
            setDietFormData(prev => ({ ...prev, plan_type: 'diet' }));
            setPlanType('diet');
          }}
        >
          Diet
          <FaBowlFood className='ml-2'/>
        </button>
      </div>
    </div>
  )
}