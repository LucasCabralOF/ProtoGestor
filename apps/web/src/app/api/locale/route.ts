import { NextResponse } from "next/server";

const allowed = new Set(["pt-BR", "en"]);

export async function POST(req: Request) {
  const { locale } = await req.json().catch(() => ({}));
  const value = allowed.has(locale) ? locale : "pt-BR";

  const res = NextResponse.json({ ok: true, locale: value });
  res.cookies.set("NEXT_LOCALE", value, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
  return res;
}
