'use client';

import { createContext, useState, useRef, useEffect } from 'react';
import Panel from './panel';
import {
  aiChatContextType,
  Conversation,
  Message,
  User,
} from '@/app/lib/definitions';
import TopBar from './top-bar';
import PlanFormStructure from './plan-form/form-structure';
import { dietFormDataType, dietFormRawData } from '@/public/plan_metadata/diet-formdata';
import { workoutFormDataType, workoutFormRawData } from '@/public/plan_metadata/workout-formdata';

export const aiChatContext = createContext<aiChatContextType | null>(null);

export default function ChatStructure({
  user,
  conversation,
  messages,
}: {
  user: User | undefined;
  conversation: Conversation | null;
  messages: Message[] | [];
}) {
  // AI's response
  const [response, setResponse] = useState<string>('');
  // ref variable for the chat panel div element
  const chatPanelRef = useRef<HTMLDivElement | null>(null);
  // local messages copy
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  // state used to open the plan form dynamically
  const [isSuggest, setIsSuggest] = useState<boolean>(false);
  // state that rules what plan is being created
  const [planType, setPlanType] = useState<'diet' | 'workout' | ''>('');
  // raw diet form data for the chat context
  const [dietFormData, setDietFormData] = useState<dietFormDataType | { interpretation: string }>(dietFormRawData)
  // raw workout form data for the chat context
  const [workoutFormData, setWorkoutFormData] = useState<workoutFormDataType | { interpretation: string }>(workoutFormRawData)
  // form data missing values state error
  const [missingValues, setMissingValues] = useState<string[]>([]);
  // loading state for plan generation
  const [generatingPlan, setGeneratingPlan] = useState<boolean>(false);
  // checking if AI is still writing text
  const [isAIWriting, setIsAIWriting] = useState<boolean>(false);
  // loading state for when plan is being saved
  const [savingPlan, setSavingPlan] = useState<boolean>(false);

  const values = {
    response,
    setResponse,
    localMessages,
    setLocalMessages,
    chatPanelRef,
    user,
    conversation,
    messages,
    isSuggest,
    setIsSuggest,
    planType,
    setPlanType,
    dietFormData,
    setDietFormData,
    workoutFormData,
    setWorkoutFormData,
    missingValues,
    setMissingValues,
    generatingPlan,
    setGeneratingPlan,
    isAIWriting,
    setIsAIWriting,
    savingPlan,
    setSavingPlan
  };

  // updating the local messages array with the db array of messages
  useEffect(() => setLocalMessages(messages), [messages]);

  return (
    <aiChatContext.Provider value={values}>
      <div className='flex flex-col justify-center items-center relative'>
        <TopBar />
        <PlanFormStructure />
        <Panel />
      </div>
    </aiChatContext.Provider>
  );
}
