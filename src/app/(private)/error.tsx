"use client";

import Link from "next/link";
import { Button } from "@/ui/base/Button";
import { ResultPage } from "@/ui/pages/system/ResultPage";

export default function PrivateError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ResultPage
      compact
      status="500"
      title="Falha ao carregar a área privada"
      subTitle="O painel encontrou um erro inesperado. Você pode tentar novamente ou voltar ao dashboard."
      extra={[
        <Button key="retry" fit type="primary" onClick={() => reset()}>
          Tentar novamente
        </Button>,
        <Link key="dashboard" href="/dashboard">
          <Button fit type="default">
            Voltar ao dashboard
          </Button>
        </Link>,
      ]}
    />
  );
}
