import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/ui/base/Button";
import { ResultPage } from "@/ui/pages/system/ResultPage";

export default async function NotFound() {
  const t = await getTranslations("errors");

  return (
    <ResultPage
      status="404"
      title={t("notFoundTitle")}
      subTitle={t("notFoundSubtitle")}
      extra={[
        <Link key="home" href="/">
          <Button fit type="primary">
            {t("backHome")}
          </Button>
        </Link>,
        <Link key="login" href="/login">
          <Button fit type="default">
            {t("openLogin")}
          </Button>
        </Link>,
      ]}
    />
  );
}
