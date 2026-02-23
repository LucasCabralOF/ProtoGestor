"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/ui/base/Card";
import {Typography } from "@/ui/base/Typography";


export function DashboardPage() {
  const t = useTranslations("common");

  return (
    <div className="space-y-4">
      <div>
        <Typography.Title level={2} style={{ margin: 0 }}>
          {t("dashboard")}
        </Typography.Title>
        <div className="text-sm text-(--color-text-2)">
          {t("dashboardSubtitle")}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Card title="Leads">24</Card>
        <Card title="Receita">R$ 12.450</Card>
        <Card title="Pendências">3</Card>
      </div>
    </div>
  );
}
