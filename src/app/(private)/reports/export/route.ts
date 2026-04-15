import { NextResponse } from "next/server";
import { getReportsExportRows } from "@/lib/reports";
import { resolveLocale } from "@/utils/i18n";

function csvEscape(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rangeRaw = searchParams.get("range");
  const focusRaw = searchParams.get("focus");

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
  const rows = await getReportsExportRows({ range, focus }, locale);

  const lines = [["section", "metric", "value"].join(";")];

  for (const row of rows) {
    lines.push(
      [
        csvEscape(row.section),
        csvEscape(row.metric),
        csvEscape(row.value),
      ].join(";"),
    );
  }

  const csv = lines.join("\n");
  const filename = `relatorios_${range}_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
