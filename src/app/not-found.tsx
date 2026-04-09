import Link from "next/link";
import { Button } from "@/ui/base/Button";
import { ResultPage } from "@/ui/pages/system/ResultPage";

export default function NotFound() {
  return (
    <ResultPage
      status="404"
      title="Página não encontrada"
      subTitle="O endereço solicitado não existe, foi movido ou não está disponível neste ambiente."
      extra={[
        <Link key="home" href="/">
          <Button fit type="primary">
            Voltar ao início
          </Button>
        </Link>,
        <Link key="login" href="/login">
          <Button fit type="default">
            Abrir login
          </Button>
        </Link>,
      ]}
    />
  );
}
