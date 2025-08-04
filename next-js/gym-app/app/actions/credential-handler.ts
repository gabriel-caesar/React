import { authConfig } from './auth.config';
import { getUser } from './auth';
import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import bcrypt from 'bcryptjs';
import z from 'zod';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // formData
        const parsedCredentials = z // parse with zod
          .object({ email: z.email(), pass: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          // if parsed successfully
          const { email, pass } = parsedCredentials.data;

          const user = await getUser(email);
          if (!user) return null;

          // comparing formData with hashed password from db
          const passwordsMatch = await bcrypt.compare(pass, user.password);

          // returning the user if the comparison was successful
          if (passwordsMatch) return user;
        }

        return null;
      },
    }),
  ],
});
