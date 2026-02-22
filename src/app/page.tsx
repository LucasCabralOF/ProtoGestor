import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("common");

  return (
    <main style={{ padding: 24 }}>
      <h1>{t("appTitle")}</h1>
    </main>
  );
}
