import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTenantContext, isNoOrgError } from "@/lib/auth-tenant";

export default async function Home() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session) {
    redirect("/login");
  }

  try {
    await getTenantContext(session.user.id);
    redirect("/dashboard");
  } catch (error) {
    if (isNoOrgError(error)) {
      redirect("/onboarding");
    }
    throw error;
  }
}
