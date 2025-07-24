import { z } from 'zod';

// zod schema to validade user input
export const SignUpSchema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters long')
    .trim(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters long')
    .trim(),
  email: z.email({ message: 'Please enter a valid email' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      message: 'Contain at least one special character.',
    })
    .trim(),
  confirmPassword: z.string().min(8, { message: 'Be at least 8 characters long' })
}).refine( 
  data => data.password === data.confirmPassword, {
    message: `Passwords don't match`, // error message
    path: ['confirmPassword'], // where the error message will appear one
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
