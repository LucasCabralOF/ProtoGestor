import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/base/Button";
import { ResultPage } from "@/ui/pages/system/ResultPage";

export default async function PrivateNotFound() {
  const t = await getTranslations("errors");

  return (
    <ResultPage
      compact
      status="404"
      title={t("privateNotFoundTitle")}
      subTitle={t("privateNotFoundSubtitle")}
      extra={[
        <Link key="dashboard" href="/dashboard">
          <Button fit type="primary">
            {t("backDashboard")}
          </Button>
        </Link>,
        <Link key="services" href="/services">
          <Button fit type="default">
            {t("openServices")}
          </Button>
        </Link>,
      ]}
    />
  );
}
