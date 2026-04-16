"use client";

import "./globals.css";
import Link from "next/link";
import { Button } from "@/ui/base/Button";
import { ResultPage } from "@/ui/pages/system/ResultPage";
import { FallbackProviders } from "@/ui/providers/FallbackProviders";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <FallbackProviders>
          <ResultPage
            status="500"
            title="Falha crítica na aplicação"
            subTitle="A estrutura principal da aplicação não conseguiu ser montada. Tente recarregar ou volte ao início."
            extra={[
              <Button key="retry" fit type="primary" onClick={() => reset()}>
                Recarregar
              </Button>,
              <Link key="home" href="/">
                <Button fit type="default">
                  Voltar ao início
                </Button>
              </Link>,
            ]}
          />
        </FallbackProviders>
      </body>
    </html>
  );
}
