import Link from "next/link";
import { Button } from "@/ui/base/Button";
import { ResultPage } from "@/ui/pages/system/ResultPage";

export default function PrivateNotFound() {
  return (
    <ResultPage
      compact
      status="404"
      title="Conteúdo não encontrado"
      subTitle="Esta rota não existe dentro do painel atual ou foi removida."
      extra={[
        <Link key="dashboard" href="/dashboard">
          <Button fit type="primary">
            Voltar ao dashboard
          </Button>
        </Link>,
        <Link key="services" href="/services">
          <Button fit type="default">
            Abrir serviços
          </Button>
        </Link>,
      ]}
    />
  );
}
