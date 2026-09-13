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
    "inline-flex items-center justify-center rounded-md px-3.5 py-1.5 text-xs font-bold sm:px-5 sm:py-2.5 sm:text-sm transition hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-(--color-primary)";

  const className =
    variant === "primary"
      ? `${baseClassName} bg-white text-(--color-primary) shadow-sm hover:bg-emerald-50`
      : `${baseClassName} border border-white/25 bg-white/10 text-white hover:bg-white/20`;

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

  const headerNavLinkClassName =
    "rounded-md px-2.5 py-1.5 text-xs font-semibold sm:px-3 sm:py-2 sm:text-sm text-white/90 hover:bg-white/20 hover:text-white transition hover:no-underline";

  const activeHeaderNavLinkClassName =
    "rounded-md bg-white/20 px-2.5 py-1.5 text-xs font-bold sm:px-3 sm:py-2 sm:text-sm text-white border border-white/30 shadow-xs hover:no-underline";

  const footerNavLinkClassName =
    "rounded-md px-2.5 py-1.5 text-xs font-semibold sm:px-3 sm:py-2 sm:text-sm text-emerald-800 dark:text-emerald-300 transition hover:bg-emerald-500/10 hover:text-emerald-950 dark:hover:text-white hover:no-underline";

  return (
    <div className="min-h-screen bg-(--color-base-3) text-(--color-text-1)">
      <div className="relative">
        <header className="px-3 pt-3 sm:px-6 sm:pt-6">
          <div
            className="mx-auto flex max-w-[1440px] items-center justify-between rounded-xl border border-emerald-800/40 bg-(--color-primary) px-3.5 py-2.5 shadow-md sm:px-6 sm:py-3.5 text-white"
            data-testid="marketing-header"
          >
            <Link
              className="flex items-center gap-2.5 sm:gap-3 hover:no-underline"
              href="/"
            >
              <span className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-white text-xs font-black tracking-[0.18em] text-(--color-primary) shadow-xs">
                C
              </span>
              <span className="flex flex-col">
                <span className="text-xs sm:text-sm font-bold tracking-[0.12em] uppercase text-white">
                  {common("appTitle")}
                </span>
                <span className="hidden sm:block text-xs text-white/80">
                  {t("footer.copy")}
                </span>
              </span>
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <nav className="hidden items-center gap-1 md:flex">
                <Link
                  className={
                    currentPage === "home"
                      ? activeHeaderNavLinkClassName
                      : headerNavLinkClassName
                  }
                  href="/"
                >
                  {t("nav.home")}
                </Link>
                <Link
                  className={
                    currentPage === "pricing"
                      ? activeHeaderNavLinkClassName
                      : headerNavLinkClassName
                  }
                  href="/pricing"
                >
                  {t("nav.pricing")}
                </Link>
              </nav>

              <Link
                className={headerNavLinkClassName}
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

        <footer className="px-3 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-6 rounded-xl border border-(--color-border) bg-white px-4 py-5 shadow-sm dark:bg-(--color-base-1) sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.12em] uppercase">
                {common("appTitle")}
              </p>
              <p className="mt-2 text-xs sm:text-sm leading-6 sm:leading-7 text-(--color-text-2)">
                {t("footer.copy")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <Link className={footerNavLinkClassName} href="/pricing">
                {t("nav.pricing")}
              </Link>
              <Link className={footerNavLinkClassName} href="/login">
                {t("nav.login")}
              </Link>
              <Link className={footerNavLinkClassName} href="/signup">
                {t("nav.signup")}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
