// src/app/(private)/clientes/export/route.ts
import { NextResponse } from "next/server";
import { getClientsForExport } from "@/lib/clients";

function csvEscape(v: string): string {
  const s = v.replaceAll('"', '""');
  return `"${s}"`;
}

export async function GET() {
  const rows = await getClientsForExport();

  const header = [
    "name",
    "type",
    "document",
    "email",
    "phone",
    "whatsapp",
    "isActive",
    "addressLine1",
    "city",
    "state",
    "postalCode",
  ];

  const lines = [header.join(";")];

  for (const r of rows) {
    const line = [
      csvEscape(r.name),
      csvEscape(r.type),
      csvEscape(r.document ?? ""),
      csvEscape(r.email ?? ""),
      csvEscape(r.phone ?? ""),
      csvEscape(r.whatsapp ?? ""),
      csvEscape(r.isActive ? "true" : "false"),
      csvEscape(r.addressLine1 ?? ""),
      csvEscape(r.city ?? ""),
      csvEscape(r.state ?? ""),
      csvEscape(r.postalCode ?? ""),
    ];
    lines.push(line.join(";"));
  }

  const csv = lines.join("\n");
  const filename = `clientes_${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
