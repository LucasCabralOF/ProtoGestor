import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTenantContext, isNoOrgError } from "@/lib/auth-tenant";
import { LoginForm } from "@/ui/pages/auth/LoginForm";

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return <LoginForm />;
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
