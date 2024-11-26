import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import jwt from 'jsonwebtoken';
import { getApiUrl } from '@/utils/api';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        const res = await fetch(`${getApiUrl()}/api/user/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const user = await res.json();

        if (res.ok && user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const decodedToken = jwt.verify(
          user.token,
          JWT_SECRET
        ) as jwt.JwtPayload & {
          id: string;
          role: string;
          username: string;
          email: string;
        };

        token.id = decodedToken.id;
        token.role = decodedToken.role;
        token.email = decodedToken.email;
        token.accessToken = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.email = token.email as string;
      session.user.token = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
  theme: {
    colorScheme: 'dark',
  },
};
