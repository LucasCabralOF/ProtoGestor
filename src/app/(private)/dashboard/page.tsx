import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";
import { DashboardPage } from "@/ui/pages/privatePages/DashboardPage";

function headersToObject(h: Headers) {
  const obj: Record<string, string> = {};
  h.forEach((v, k) => (obj[k] = v));
  return obj;
}

export default async function DashboardRoute() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: headersToObject(h) });
  if (!session) redirect("/login");

  const data = await getDashboardData(session.user.id);

  return <DashboardPage userName={session.user.name ?? "Admin"} data={data} />;
}
