import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTenantContext, isNoOrgError } from "@/lib/auth-tenant";
import { SignupForm } from "@/ui/pages/auth/SignupForm";

export default async function SignupPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return <SignupForm />;
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
