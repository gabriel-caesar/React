'use client';

import { dietFormDataType } from '@/public/plan_metadata/diet-formdata';
import { aiChatContext } from '../chat-structure';
import { useContext, useEffect } from 'react';
import GetStarted from './get-started';
import Sections from './sections';
import { generatePlan } from '@/app/actions/frontend-ui/ai-chat';
import { workoutFormDataType } from '@/public/plan_metadata/workout-formdata';

export default function PlanFormStructure() {
  // safely checking if context is actually passed right
  function useAIChatContext() {
    const context = useContext(aiChatContext);
    if (!context)
      throw new Error('useAIChatContext must be used within a Provider');
    return context;
  }

  // context from chat-structure.tsx
  const { 
    isSuggest,
    planType, 
    dietFormData, 
    workoutFormData,
    setDietFormData, 
    setWorkoutFormData,
    setMissingValues, 
    setGeneratingPlan,
    setIsSuggest,
    missingValues,
  } = useAIChatContext();

  async function handleFormSubmission() {
    setGeneratingPlan(true); // starts the generating plan loader
    try {
      // creates the plan in JSON
      const response = await generatePlan(
        planType === 'diet' ? dietFormData as dietFormDataType : workoutFormData as workoutFormDataType,
        planType === 'diet' ? true : false
      ); 

      if (Array.isArray(response)) {// if the function returns the array with missing fields
        setMissingValues(response);
      } else {
        setMissingValues([]);
      };

      if (response.interpretation) {
        if (planType === 'diet') setDietFormData(response.interpretation as dietFormDataType)
        if (planType === 'workout') setWorkoutFormData(response.interpretation as workoutFormDataType)
      };

    } catch (error) {
      throw new Error(`Couldn't submit plan generation form. ${error}`);
    } finally {
      setGeneratingPlan(false); // stops the generating plan loader
      if (!missingValues) setIsSuggest(false); // closes the plan form
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleFormSubmission();
      }}
      data-testid='plan-choices-container'
      id='plan-form-container'
      className={`
        ${isSuggest ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        rounded-lg p-2 transition-all duration-300 fixed bg-[linear-gradient(45deg,#000_50%,#575656)]
        border-1 border-neutral-500 bottom-25 left-1/2 -translate-x-1/2 w-11/12 z-4
        md:w-3/4 lg:w-1/2 xl:w-1/4
      `}
    >
      {planType !== '' ? <Sections /> : <GetStarted />}
    </form>
  );
}
