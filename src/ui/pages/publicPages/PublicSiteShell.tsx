import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

function ActionLink({
  children,
  href,
  testId,
  variant = "secondary",
}: {
  children: ReactNode;
  href: string;
  testId?: string;
  variant?: "primary" | "secondary";
}) {
  const baseClassName =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-base-3)";

  const className =
    variant === "primary"
      ? `${baseClassName} bg-(--color-primary) text-white shadow-[0_18px_50px_rgba(22,119,255,0.24)] hover:brightness-110`
      : `${baseClassName} border border-(--color-border) bg-(--color-base-1) text-(--color-text-1)`;

  return (
    <Link className={className} data-testid={testId} href={href}>
      {children}
    </Link>
  );
}

export async function PublicSiteShell({
  children,
  currentPage,
}: {
  children: ReactNode;
  currentPage: "home" | "pricing";
}) {
  const common = await getTranslations("common");
  const t = await getTranslations("marketing");

  const navLinkClassName =
    "rounded-full px-3 py-2 text-sm font-medium text-(--color-text-2) transition hover:bg-white/60 hover:text-(--color-text-1) hover:no-underline dark:hover:bg-white/6";

  const activeNavLinkClassName =
    "rounded-full bg-(--color-base-1) px-3 py-2 text-sm font-medium text-(--color-text-1) shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:no-underline";

  return (
    <div className="marketing-grid-pattern min-h-screen bg-(--color-base-3) text-(--color-text-1)">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="marketing-pulse absolute -left-10 top-0 h-72 w-72 rounded-full bg-[rgba(22,119,255,0.18)] blur-3xl dark:bg-[rgba(22,119,255,0.24)]" />
        <div className="marketing-float-fast absolute right-0 top-16 h-64 w-64 rounded-full bg-[rgba(15,23,42,0.08)] blur-3xl dark:bg-[rgba(255,255,255,0.06)]" />
        <div className="marketing-float-slow absolute bottom-10 left-1/3 h-44 w-44 rounded-full bg-[rgba(16,185,129,0.12)] blur-3xl dark:bg-[rgba(16,185,129,0.12)]" />
      </div>

      <div className="relative">
        <header className="px-6 pt-6">
          <div
            className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/70 bg-white/75 px-5 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/8 dark:bg-[rgba(20,20,20,0.82)]"
            data-testid="marketing-header"
          >
            <Link
              className="flex items-center gap-3 hover:no-underline"
              href="/"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-(--color-primary) text-xs font-black tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(22,119,255,0.24)]">
                P
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold tracking-[0.12em] uppercase text-(--color-text-1)">
                  {common("appTitle")}
                </span>
                <span className="text-xs text-(--color-text-2)">
                  {t("footer.copy")}
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <nav className="hidden items-center gap-1 md:flex">
                <Link
                  className={
                    currentPage === "home"
                      ? activeNavLinkClassName
                      : navLinkClassName
                  }
                  href="/"
                >
                  {t("nav.home")}
                </Link>
                <Link
                  className={
                    currentPage === "pricing"
                      ? activeNavLinkClassName
                      : navLinkClassName
                  }
                  href="/pricing"
                >
                  {t("nav.pricing")}
                </Link>
              </nav>

              <Link
                className={navLinkClassName}
                data-testid="marketing-link-login"
                href="/login"
              >
                {t("nav.login")}
              </Link>
              <ActionLink
                href="/signup"
                testId="marketing-link-signup"
                variant="primary"
              >
                {t("nav.signup")}
              </ActionLink>
            </div>
          </div>
        </header>

        <main>{children}</main>

        <footer className="px-6 pb-10 pt-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[32px] border border-white/70 bg-white/70 px-6 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/8 dark:bg-[rgba(20,20,20,0.8)] md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.12em] uppercase">
                {common("appTitle")}
              </p>
              <p className="mt-2 text-sm leading-7 text-(--color-text-2)">
                {t("footer.copy")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link className={navLinkClassName} href="/pricing">
                {t("nav.pricing")}
              </Link>
              <Link className={navLinkClassName} href="/login">
                {t("nav.login")}
              </Link>
              <Link className={navLinkClassName} href="/signup">
                {t("nav.signup")}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
