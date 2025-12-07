import { z } from 'zod';
import { getUser } from '../actions/auth';
import React, { Dispatch, JSX, RefObject, SetStateAction } from 'react';
import { dietFormDataType } from '@/public/plan_metadata/diet-formdata';
import { workoutFormDataType } from '@/public/plan_metadata/workout-formdata';

// zod schema to validade user input
export const SignUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, 'First name must be at least 2 characters long')
      .trim(),
    lastName: z
      .string()
      .min(2, 'Last name must be at least 2 characters long')
      .trim(),
    email: z.string().email({ message: 'Please enter a valid email' }).trim(),
    password: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' })
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter' })
      .regex(/[0-9]/, { message: 'Contain at least one number' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character',
      })
      .trim(),
    confirmPassword: z
      .string()
      .min(8, { message: 'Be at least 8 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: `Passwords don't match`, // error message
    path: ['confirmPassword'], // where the error message will appear one
  })
  .refine(
    // checks if email is already in use
    async (data) => !(await getUser(data.email)),
    {
      message: 'Email already in use',
      path: ['email'],
    }
  );

// a state that is returned if any input shows an error
export type FormState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
};

// user type
export type User = {
  firstname: string;
  lastname: string;
  email: string;
  id: string;
  password: string;
};

// db message type
export type Message = {
  sent_date: string;
  message_content: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  id: string;
  form_data?: dietFormDataType | workoutFormDataType | null;
  plan_saved: boolean;
};

// db conversation type
export type Conversation = {
  id: string;
  title: string;
  last_message_date: string;
  created_date: string;
  user_id: string;
};

// context API type created on chat-structure.tsx
export type aiChatContextType = {
  response: string;
  setResponse: Dispatch<SetStateAction<string>>;
  chatPanelRef: RefObject<HTMLDivElement | null>;
  user: User | undefined;
  setLocalMessages: Dispatch<SetStateAction<Message[]>>;
  localMessages: Message[];
  conversation: Conversation | null;
  messages: Message[] | [];
  isSuggest: boolean;
  setIsSuggest: React.Dispatch<SetStateAction<boolean>>;
  planType: 'diet' | 'workout' | '';
  setPlanType: React.Dispatch<SetStateAction<'diet' | 'workout' | ''>>;
  dietFormData: dietFormDataType | { interpretation: string };
  setDietFormData: React.Dispatch<SetStateAction<dietFormDataType | { interpretation: string }>>;
  workoutFormData: workoutFormDataType | { interpretation: string };
  setWorkoutFormData: React.Dispatch<SetStateAction<workoutFormDataType | { interpretation: string }>>;
  missingValues: string[];
  setMissingValues: React.Dispatch<SetStateAction<string[]>>;
  generatingPlan: boolean;
  setGeneratingPlan: React.Dispatch<SetStateAction<boolean>>;
  isAIWriting: boolean;
  setIsAIWriting: React.Dispatch<SetStateAction<boolean>>;
  savingPlan: boolean;
  setSavingPlan: React.Dispatch<SetStateAction<boolean>>;
};

// this is used to tell the type of the objects
// included in the conversation history array
export type aiChatHistoryType = {
  content: string;
  role: 'user' | 'assistant' | 'system';
};

// what's being rendered in the diet plan form
export type sectionType = {
  prop: string;
  title: string;
  desc?: string;
  buttons?: {
    id: string;
    name: string;
    icon?: JSX.Element;
  }[];
  inputs?: {
    regex?: RegExp;
    style?: string;
    label?: string;
    id: string;
    placeholder: string;
    error?: string;
  }[];
  textareas?: {
    label?: string;
    style?: string;
    id: string,
    placeholder: string;
  }[]
};

export type dietPlanType = dietFormDataType & {
  id: string,
  created_date: string | Date,
  last_edit_date: string | Date,
  user_id: string,
  default_plan: boolean,
}

export type workoutPlanType = workoutFormDataType & {
  id: string,
  created_date: string | Date,
  last_edit_date: string | Date,
  user_id: string,
  default_plan: boolean,
}
