import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "~/server/db";
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      age?: number;
      sex?: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    age?: number;
    sex?: string;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },
  providers: [
    DiscordProvider({
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
    }),
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email
        const user = await db.user.findFirst({
          where: { email: credentials.email }
        });

        // Check if user exists and has a password
        if (!user || !user.password) {
          return null;
        }

        // Compare password
        try {
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            age: user.age,
            sex: user.sex,
          };
        } catch (error) {
          console.error("Error comparing passwords:", error);
          return null;
        }
      }
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    session: ({ session, token }) => {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      
      if (token.age !== undefined && session.user) {
        session.user.age = token.age as number;
      }
      
      if (token.sex !== undefined && session.user) {
        session.user.sex = token.sex as string;
      }
      
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id;
        token.age = user.age;
        token.sex = user.sex;
      }
      return token;
    },
    signIn: async ({ user, account, profile }) => {
      try {
        // If this is a regular email/password sign-in, proceed normally
        if (!account || account.provider === "credentials") {
          return true;
        }

        // Handle OAuth sign-ins 
        if (account.provider && account.providerAccountId) {
          // First, check if this exact account already exists
          const existingAccount = await db.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId
              }
            },
            include: { user: true }
          });

          // If we found the exact same account, use that user
          if (existingAccount) {
            user.id = existingAccount.user.id;
            console.log(`Found existing account for ${account.provider} with ID ${account.providerAccountId}`);
            return true;
          }

          // No existing account found - this is a new OAuth login
          // Create a unique user identifier based on provider and account ID
          const providerEmail = user.email 
            ? `${user.email}.${account.provider}.${account.providerAccountId.substring(0, 8)}`
            : `${account.provider}_${account.providerAccountId}@symptotrack.local`;
          
          try {
            // Create a new user with provider-specific email to avoid conflicts
            const newUser = await db.user.create({
              data: {
                name: user.name ?? `${account.provider.charAt(0).toUpperCase() + account.provider.slice(1)} User`,
                email: providerEmail,
                image: user.image ?? null,
                accounts: {
                  create: {
                    type: account.type ?? "oauth",
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token ?? null,
                    expires_at: account.expires_at ?? null,
                    token_type: account.token_type ?? null,
                    scope: account.scope ?? null,
                    id_token: account.id_token ?? null,
                    session_state: account.session_state ?? null,
                  }
                }
              }
            });
            
            user.id = newUser.id;
            console.log(`Created new user for ${account.provider} with provider ID: ${account.providerAccountId}`);
            return true;
          } catch (error) {
            console.error(`Error creating user for ${account.provider}:`, error);
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    }
  },
  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;
