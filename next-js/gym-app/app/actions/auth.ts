import { FormState, SignUpSchema } from '../lib/definitions';

export function signup(state: FormState | undefined, formData: FormData) {

  // validate form data
  // safeParse returns a plain obj containing either the parsed data or a ZodError
  const validatedFields = SignUpSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('pass'),
    confirmPassword: formData.get('confirmPass'),
  })

  // returning the error feedback if that's the case
  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to sign up user.',
    }
  }

}
