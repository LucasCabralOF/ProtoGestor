import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";

export default async function Home() {
  const t = await getTranslations("common");

  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (session) {
    redirect("/dashboard");
  }

  redirect("/login");

  // fallback (não deve renderizar)
  return (
    <main style={{ padding: 24 }}>
      <h1>{t("appTitle")}</h1>
    </main>
  );
}
