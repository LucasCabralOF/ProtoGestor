import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTenantContext, isNoOrgError } from "@/lib/auth-tenant";
import { OnboardingPage } from "@/ui/pages/onboarding/OnboardingPage";

export default async function OnboardingRoute({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  try {
    await getTenantContext(session.user.id);
    redirect("/dashboard");
  } catch (error) {
    if (!isNoOrgError(error)) {
      throw error;
    }
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const initialRole = resolvedParams.role === "member" ? "member" : "owner";

  return (
    <OnboardingPage
      initialRole={initialRole}
      userEmail={session.user.email ?? null}
      userName={session.user.name ?? "User"}
    />
  );
}
