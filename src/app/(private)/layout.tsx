import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import type { User } from "@/types/base";
import { PrivateShell } from "@/ui/pages/layout_private/PrivateShell";

export default async function PrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const user: User = {
    id: session.user.id,
    name: session.user.name ?? "User",
    email: session.user.email ?? null,
    role: "user",
  };

  return <PrivateShell user={user}>{children}</PrivateShell>;
}
