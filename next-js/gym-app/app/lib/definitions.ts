import { z } from 'zod';
import { getUser } from '../actions/auth';
import { Dispatch, RefObject, SetStateAction } from 'react';

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
  has_diet_plan: boolean;
  has_workout_plan: boolean;
  id: string;
  password: string;
};

// db message type
export type Message = {
  sent_date: string;
  message_content: string;
  conversation_id: string;
  role: 'user' | 'ai';
  id: string;
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
};

// this is used to tell the type of the objects
// included in the conversation history array
export type aiChatHistoryType = {
  messageContent: string;
  sentDate: string;
  role: string;
}[];
