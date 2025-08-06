'use server';

import { AuthError } from 'next-auth';
import { FormState, SignUpSchema, User } from '../lib/definitions';
import { signIn } from './credential-handler';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function signup(state: FormState | undefined, formData: FormData) {
  // validate form data
  // safeParse returns a plain obj containing either the parsed data or a ZodError
  const validatedFields = await SignUpSchema.safeParseAsync({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('pass'),
    confirmPassword: formData.get('confirmPass'),
  });

  // returning the error feedback if that's the case
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to sign up user.',
    };
  }

  // preparing data to insert into the db
  const { firstName, lastName, email, password } = validatedFields.data;

  // hashing the password
  const hashedPass = await bcrypt.hash(password, 10);

  // creating a custom FormData to call authenticate in order
  // to login the user automatically after registration
  const loginData = new FormData();
  loginData.set('email', email);
  loginData.set('pass', password);

  try {
    // store user in db
    await sql`
        INSERT INTO users (firstname, lastname, email, password) 
        VALUES (${firstName}, ${lastName}, ${email}, ${hashedPass});
      `;
  } catch (error) {
    console.log(`\n An error has ocurred. ${error}\n`)
    return {
      message: `${error} Database error, couldn't fetch db.`,
    };
  } 

  // using a query param to indicate that the user
  // freshly registered and it's ready to log in
  const user = await getUser(email);
  if (user) return redirect('/login?registered=true');
}

// gets user from db
export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`
    SELECT * FROM users
    WHERE email=${email}
    `;

    return user[0];
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Couldn't fetch user from db. ${error.message}.`);
    }
    throw new Error(`Couldn't fetch user from db. Unknown error.`);
  }
}

// authenticate user
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error: any) {

    // preventing this function to swallow NEXT_REDIRECT error and avoid redirecting the user
    // that happens when the user signs up and then is automatically redirected to the dashboard
    if (error.digest === 'NEXT_REDIRECT;push;http://localhost:3000/get-started;307;') return

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'; // error message
        default:
          return 'Something went wrong.'; // error message
      }
    }
    throw error;
  }
}
