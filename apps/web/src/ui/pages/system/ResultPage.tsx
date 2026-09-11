import type { ReactNode } from "react";
import { Card } from "@/ui/base/Card";
import { Result } from "@/ui/base/Result";

export function ResultPage({
  compact = false,
  extra,
  status,
  subTitle,
  title,
}: {
  compact?: boolean;
  extra?: ReactNode;
  status: "403" | "404" | "500" | "error" | "info" | "success" | "warning";
  subTitle: ReactNode;
  title: ReactNode;
}) {
  const shellClassName = compact
    ? "flex min-h-[calc(100vh-10rem)] items-center justify-center"
    : "flex min-h-screen items-center justify-center";

  return (
    <div className="relative overflow-hidden bg-(--color-base-3)">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-(--color-primary)/10 blur-3xl" />
        <div className="absolute bottom-12 right-0 h-64 w-64 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className={`${shellClassName} px-4 py-8`}>
        <Card className="w-full max-w-4xl border border-(--color-border) bg-(--color-base-4) shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <Result
            status={status}
            title={title}
            subTitle={subTitle}
            extra={extra}
          />
        </Card>
      </div>
    </div>
  );
}
