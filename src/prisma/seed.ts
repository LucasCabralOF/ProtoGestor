import "dotenv/config";
import process from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

// seed roda a partir de /prisma, então o auth fica em /src
import { auth } from "@/lib/auth";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function ensureUserViaAuth(params: { email: string; name: string; password: string }) {
  try {
    const res = await auth.api.signUpEmail({
      // se sua versão exigir headers, descomente:
      // headers: {},
      body: {
        email: params.email,
        name: params.name,
        password: params.password,
      },
    });
    return res.user;
  } catch (err: any) {
    const existing = await prisma.user.findUnique({ where: { email: params.email } });
    if (existing) return existing;
    throw err;
  }
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
}
function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * 24 * 60 * 60 * 1000);
}
function addMonths(d: Date, months: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
}

async function main() {
  // 1) Usuário demo (login real via Better Auth)
  const demo = await ensureUserViaAuth({
    email: "demo@local.dev",
    name: "Admin",
    password: "Demo@1234",
  });

  await prisma.user.update({
    where: { id: demo.id },
    data: { emailVerified: true },
  });

  // 2) Org demo (id fixo p/ upsert)
  const org = await prisma.organization.upsert({
    where: { id: "org_demo" },
    update: { name: "Empresa Teste", slug: "empresa-teste" },
    create: { id: "org_demo", name: "Empresa Teste", slug: "empresa-teste" },
  });

  // 3) Membership (vínculo user ↔ org)
  await prisma.membership.upsert({
    where: { orgId_userId: { orgId: org.id, userId: demo.id } },
    update: { role: "owner" },
    create: { orgId: org.id, userId: demo.id, role: "owner" },
  });

  // 4) Limpa dados da ORG (idempotente) — ordem respeita FKs
  await prisma.$transaction([
    prisma.activityLog.deleteMany({ where: { orgId: org.id } }),
    prisma.appointment.deleteMany({ where: { orgId: org.id } }),
    prisma.calendarBlock.deleteMany({ where: { orgId: org.id } }),
    prisma.serviceOrderItem.deleteMany({ where: { orgId: org.id } }),
    prisma.serviceOrder.deleteMany({ where: { orgId: org.id } }),
    prisma.transaction.deleteMany({ where: { orgId: org.id } }),
    prisma.category.deleteMany({ where: { orgId: org.id } }),
    prisma.financialAccount.deleteMany({ where: { orgId: org.id } }),
    prisma.contactTagLink.deleteMany({ where: { orgId: org.id } }),
    prisma.tag.deleteMany({ where: { orgId: org.id } }),
    prisma.address.deleteMany({ where: { orgId: org.id } }),
    prisma.contactRole.deleteMany({ where: { orgId: org.id } }),
    prisma.contact.deleteMany({ where: { orgId: org.id } }),
  ]);

  // 5) Contatos (clientes + funcionário) usando Contact + ContactRole
  const maria = await prisma.contact.create({
    data: {
      orgId: org.id,
      type: "person",
      name: "Maria Souza",
      document: "CUST-0001",
      email: "maria@teste.com",
      phone: "(48) 99999-1111",
      whatsapp: "(48) 99999-1111",
      isActive: true,
    },
  });

  const joao = await prisma.contact.create({
    data: {
      orgId: org.id,
      type: "person",
      name: "João Silva",
      document: "CUST-0002",
      email: "joao@teste.com",
      phone: "(48) 99999-2222",
      isActive: true,
    },
  });

  const ana = await prisma.contact.create({
    data: {
      orgId: org.id,
      type: "person",
      name: "Ana Lima",
      document: "EMP-0001",
      email: "ana@teste.com",
      phone: "(48) 99999-3333",
      isActive: true,
    },
  });

  await prisma.contactRole.createMany({
    data: [
      { orgId: org.id, contactId: maria.id, role: "customer" },
      { orgId: org.id, contactId: joao.id, role: "customer" },
      { orgId: org.id, contactId: ana.id, role: "employee" },
    ],
  });

  await prisma.address.create({
    data: {
      orgId: org.id,
      contactId: maria.id,
      label: "Casa",
      line1: "Rua das Flores, 123",
      city: "Florianópolis",
      state: "SC",
      postalCode: "88000-000",
      isPrimary: true,
    },
  });

  const tagVip = await prisma.tag.create({
    data: { orgId: org.id, name: "VIP", colorHex: "#1677ff" },
  });

  await prisma.contactTagLink.create({
    data: { orgId: org.id, contactId: maria.id, tagId: tagVip.id },
  });

  // 6) Financeiro (Conta + Categorias + Transações)
  const acc = await prisma.financialAccount.create({
    data: { orgId: org.id, name: "Conta Principal", type: "bank", isActive: true },
  });

  const catSales = await prisma.category.create({
    data: { orgId: org.id, name: "Serviços", type: "income" },
  });

  const catOps = await prisma.category.create({
    data: { orgId: org.id, name: "Operacional", type: "expense" },
  });

  const now = new Date();
  const thisMonthPaid = addDays(startOfDay(now), -1);
  const lastMonthPaid = addDays(startOfDay(addMonths(now, -1)), 2);

  // Receita mês atual (R$ 12.450,00)
  await prisma.transaction.create({
    data: {
      orgId: org.id,
      type: "income",
      status: "paid",
      amountCents: 1245000,
      paidAt: thisMonthPaid,
      description: "Receita mensal (demo)",
      accountId: acc.id,
      categoryId: catSales.id,
      contactId: maria.id,
    },
  });

  // Receita mês passado (p/ delta)
  await prisma.transaction.create({
    data: {
      orgId: org.id,
      type: "income",
      status: "paid",
      amountCents: 900000,
      paidAt: lastMonthPaid,
      description: "Receita mês anterior (demo)",
      accountId: acc.id,
      categoryId: catSales.id,
      contactId: joao.id,
    },
  });

  // Despesa (só pra ter no banco)
  await prisma.transaction.create({
    data: {
      orgId: org.id,
      type: "expense",
      status: "paid",
      amountCents: 120000,
      paidAt: thisMonthPaid,
      description: "Material de limpeza (demo)",
      accountId: acc.id,
      categoryId: catOps.id,
      contactId: joao.id,
    },
  });

  // 7) Serviço + Agendamento
  const so = await prisma.serviceOrder.create({
    data: {
      orgId: org.id,
      status: "scheduled",
      title: "Limpeza Residencial",
      description: "Apartamento 2 quartos",
      customerId: maria.id,
      valueCents: 25000,
    },
  });

  await prisma.serviceOrderItem.createMany({
    data: [
      { orgId: org.id, serviceOrderId: so.id, title: "Limpeza Geral", qty: 1, unitPriceCents: 20000 },
      { orgId: org.id, serviceOrderId: so.id, title: "Vidros", qty: 1, unitPriceCents: 5000 },
    ],
  });

  const tomorrow = addDays(startOfDay(now), 1);
  const startsAt = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 9, 0, 0);
  const endsAt = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 11, 0, 0);

  await prisma.appointment.create({
    data: {
      orgId: org.id,
      status: "scheduled",
      serviceOrderId: so.id,
      startsAt,
      endsAt,
      employeeId: ana.id,
      locationText: "Rua das Flores, 123",
    },
  });

  // 8) Atividade recente
  await prisma.activityLog.createMany({
    data: [
      { orgId: org.id, userId: demo.id, message: "Novo cliente cadastrado: Maria Souza", entityType: "contact", entityId: maria.id },
      { orgId: org.id, userId: demo.id, message: "Serviço agendado: Limpeza Residencial (amanhã)", entityType: "service_order", entityId: so.id },
      { orgId: org.id, userId: demo.id, message: "Pagamento recebido: R$ 12.450,00", entityType: "fin_transaction" },
    ],
  });

  console.log("✅ Seed OK:", {
    org: org.name,
    user: demo.email,
    customers: 2,
    employee: 1,
    serviceOrder: so.title,
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });