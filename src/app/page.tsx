import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTenantContext, isNoOrgError } from "@/lib/auth-tenant";
import { MarketingHomePage } from "@/ui/pages/publicPages/MarketingHomePage";

export default async function Home() {
  const h = await headers();
  const session = await auth.api.getSession({ headers: h });

  if (!session) {
    return <MarketingHomePage />;
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
