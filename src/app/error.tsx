"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/base/Button";
import { ResultPage } from "@/ui/pages/system/ResultPage";

export default function AppErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <ResultPage
      status="500"
      title={t("appErrorTitle")}
      subTitle={t("appErrorSubtitle")}
      extra={[
        <Button key="retry" fit type="primary" onClick={() => reset()}>
          {t("retry")}
        </Button>,
        <Link key="dashboard" href="/dashboard">
          <Button fit type="default">
            {t("goDashboard")}
          </Button>
        </Link>,
      ]}
    />
  );
}
