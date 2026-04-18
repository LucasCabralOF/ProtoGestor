import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTenantContext, isNoOrgError } from "@/lib/auth-tenant";
import { MarketingHomePage } from "@/ui/pages/publicPages/MarketingHomePage";

export default async function Home() {
  const h = await headers();
  let session = null;
  try {
    session = await auth.api.getSession({ headers: h });
  } catch (_error) {
    // Ignore error
  }

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
