import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { User, ErrorCode } from './app/[locale]/lib/types';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials;
        const user = await getUser(email as string);
        if (!user) throw new Error(ErrorCode.UserNotFound);

        const passwordsMatch = await bcrypt.compare(password as string, user.password);
        if (passwordsMatch) return user;
        throw new Error(ErrorCode.PasswordsNotMatch);
      }
    })
  ]
})
