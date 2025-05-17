import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  advanced: {
    crossSubDomainCookies: process.env.NODE_ENV === 'production'
      ? {
          enabled: true,
          domain: '.teddyjournal.com',
        }
      : undefined,
    defaultCookieAttributes: {
      secure: process.env.NODE_ENV === "production", // Only require secure in production
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Use lax in development
      partitioned: process.env.NODE_ENV === "production" ? true : false,
    },
  },
  trustedOrigins: [
    'https://www.teddyjournal.com',
    'https://teddyjournal.com',
    'https://www.api.teddyjournal.com',
    'https://api.teddyjournal.com',
    'http://localhost:3000', // For local development
  ],
});
