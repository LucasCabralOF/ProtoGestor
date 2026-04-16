const COOKIE_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 365;

export async function setClientCookie(name: string, value: string) {
  await cookieStore.set({
    name,
    value,
    path: "/",
    sameSite: "lax",
    expires: Date.now() + COOKIE_MAX_AGE_MS,
  });
}
