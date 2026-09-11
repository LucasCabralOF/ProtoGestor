"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/ui/base/Button";
import { ResultPage } from "@/ui/pages/system/ResultPage";

export default function PrivateError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

  return (
    <ResultPage
      compact
      status="500"
      title={t("privateErrorTitle")}
      subTitle={t("privateErrorSubtitle")}
      extra={[
        <Button key="retry" fit type="primary" onClick={() => reset()}>
          {t("retry")}
        </Button>,
        <Link key="dashboard" href="/dashboard">
          <Button fit type="default">
            {t("backDashboard")}
          </Button>
        </Link>,
      ]}
    />
  );
}
