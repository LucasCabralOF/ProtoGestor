import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { bearer } from "better-auth/plugins";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  // secret/baseURL podem vir do env automaticamente,
  // mas eu gosto de deixar explícito:
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  database: prismaAdapter(prisma, { provider: "postgresql" }),

  emailAndPassword: {
    enabled: true,
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },

  // bearer plugin permite Authorization: Bearer <token> para Expo/Mobile
  // importantíssimo: nextCookies deve ser o último plugin
  plugins: [bearer(), nextCookies()],
});
