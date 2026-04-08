// src/app/(private)/clients/import/route.ts
import { NextResponse } from "next/server";
import { requireOrgId } from "@/lib/auth-tenant";
import prisma from "@/lib/prisma";

function parseCsv(text: string): {
  headers: string[];
  rows: Record<string, string>[];
} {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return { headers: [], rows: [] };

  const sep = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map((h) => h.trim());

  const rows: Record<string, string>[] = [];

  for (const line of lines.slice(1)) {
    const cols = line
      .split(sep)
      .map((c) => c.trim().replace(/^"|"$/g, "").replaceAll('""', '"'));
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = cols[i] ?? "";
    });
    rows.push(obj);
  }

  return { headers, rows };
}

function toBool(v: string): boolean | null {
  const s = v.trim().toLowerCase();
  if (s === "") return null;
  if (["true", "1", "yes", "sim"].includes(s)) return true;
  if (["false", "0", "no", "nao", "não"].includes(s)) return false;
  return null;
}

export async function POST(req: Request) {
  try {
    const { orgId } = await requireOrgId();

    const fd = await req.formData();
    const file = fd.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Arquivo CSV não enviado." },
        { status: 400 },
      );
    }

    const text = await file.text();
    const parsed = parseCsv(text);

    if (parsed.headers.length === 0) {
      return NextResponse.json(
        { ok: false, error: "CSV vazio." },
        { status: 400 },
      );
    }

    let created = 0;
    let updated = 0;

    for (const r of parsed.rows) {
      const name = (r.name || "").trim();
      if (name.length < 2) continue;

      const type =
        (r.type || "person").trim() === "company" ? "company" : "person";
      const document = (r.document || "").trim() || null;
      const email = (r.email || "").trim().toLowerCase() || null;
      const phone = (r.phone || "").trim() || null;
      const whatsapp = (r.whatsapp || "").trim() || null;
      const isActive = toBool(r.isActive || "");
      const addressLine1 = (r.addressLine1 || "").trim() || null;
      const city = (r.city || "").trim() || null;
      const state = (r.state || "").trim() || null;
      const postalCode = (r.postalCode || "").trim() || null;

      const data = {
        orgId,
        type,
        name,
        document,
        email,
        phone,
        whatsapp,
        isActive: isActive ?? true,
      } as const;

      let contactId: string | null = null;

      if (document) {
        const up = await prisma.contact.upsert({
          where: { orgId_document: { orgId, document } },
          create: {
            ...data,
            roles: { create: { orgId, role: "customer" } },
          },
          update: data,
          select: { id: true },
        });
        contactId = up.id;
        updated += 1;
      } else if (email) {
        const existing = await prisma.contact.findFirst({
          where: { orgId, email, roles: { some: { role: "customer", orgId } } },
          select: { id: true },
        });

        if (existing) {
          await prisma.contact.update({ where: { id: existing.id }, data });
          contactId = existing.id;
          updated += 1;
        } else {
          const c = await prisma.contact.create({
            data: { ...data, roles: { create: { orgId, role: "customer" } } },
            select: { id: true },
          });
          contactId = c.id;
          created += 1;
        }
      } else {
        const c = await prisma.contact.create({
          data: { ...data, roles: { create: { orgId, role: "customer" } } },
          select: { id: true },
        });
        contactId = c.id;
        created += 1;
      }

      if (contactId && addressLine1) {
        const primary = await prisma.address.findFirst({
          where: { orgId, contactId, isPrimary: true },
          select: { id: true },
        });

        if (primary) {
          await prisma.address.update({
            where: { id: primary.id },
            data: { line1: addressLine1, city, state, postalCode },
          });
        } else {
          await prisma.address.create({
            data: {
              orgId,
              contactId,
              label: type === "company" ? "Empresa" : "Principal",
              line1: addressLine1,
              city,
              state,
              postalCode,
              country: "BR",
              isPrimary: true,
            },
          });
        }
      }
    }

    return NextResponse.json({ ok: true, created, updated });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
