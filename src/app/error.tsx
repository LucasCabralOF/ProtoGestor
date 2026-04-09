"use client";

import Link from "next/link";
import { Button } from "@/ui/base/Button";
import { ResultPage } from "@/ui/pages/system/ResultPage";

export default function AppErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ResultPage
      status="500"
      title="Algo saiu do esperado"
      subTitle="Ocorreu um erro ao renderizar esta página. Você pode tentar novamente ou voltar para uma área segura do sistema."
      extra={[
        <Button key="retry" fit type="primary" onClick={() => reset()}>
          Tentar novamente
        </Button>,
        <Link key="dashboard" href="/dashboard">
          <Button fit type="default">
            Ir para dashboard
          </Button>
        </Link>,
      ]}
    />
  );
}
