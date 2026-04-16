import { getReportsData } from "@/lib/reports";
import { ReportsPage } from "@/ui/pages/privatePages/ReportsPage";
import { resolveLocale } from "@/utils/i18n";

export default async function ReportsRoute({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : undefined;

  const rangeRaw = typeof params?.range === "string" ? params.range : "30d";
  const focusRaw =
    typeof params?.focus === "string" ? params.focus : "overview";

  const range =
    rangeRaw === "90d" || rangeRaw === "365d" || rangeRaw === "30d"
      ? rangeRaw
      : "30d";
  const focus =
    focusRaw === "finance" ||
    focusRaw === "operations" ||
    focusRaw === "overview"
      ? focusRaw
      : "overview";

  const locale = await resolveLocale();
  const data = await getReportsData({ range, focus }, locale);

  return <ReportsPage data={data} />;
}
