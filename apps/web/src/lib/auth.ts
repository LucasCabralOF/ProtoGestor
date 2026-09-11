import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { bearer } from "better-auth/plugins";
import prisma from "@/lib/prisma";

function resolveBaseUrl(): string | undefined {
  const raw =
    process.env.BETTER_AUTH_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);
  if (!raw) return undefined;
  if (!raw.startsWith("http://") && !raw.startsWith("https://")) {
    return `https://${raw}`;
  }
  return raw;
}

export const auth = betterAuth({
  // secret/baseURL podem vir do env automaticamente,
  // mas garantimos formato de protocolo valido para evitar BetterAuthError:
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: resolveBaseUrl(),

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
