import NextAuth, { NextAuthConfig } from "next-auth";
import { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Github from "next-auth/providers/github";
import { db } from "./db";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"]
  }
}

export const nextConfig: NextAuthConfig = {
  providers: [
    Github
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    session({ session, token, user}) {

      return {
        ...session,
        user: {
          ...session.user,
        }
      }
    }
  }
  
};

export const { signIn, signOut, handlers, auth } = NextAuth(nextConfig);
