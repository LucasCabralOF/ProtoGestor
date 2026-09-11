"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { FiDownload, FiPlus, FiUpload, FiUsers } from "react-icons/fi";
import { Button } from "@/ui/base/Button";

type ClientsHeaderProps = {
  exportHref: string;
  importing: boolean;
  onImport: (file: File) => void;
  onNew: () => void;
};

export function ClientsHeader({
  exportHref,
  importing,
  onImport,
  onNew,
}: ClientsHeaderProps) {
  const t = useTranslations("clients");
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-500 border border-blue-500/20">
          <FiUsers className="h-3.5 w-3.5" />
          <span>Gestão de Carteira</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight lg:text-4xl">
          {t("pageTitle")}
        </h1>
        <p className="mt-1 text-sm text-(--color-text-2)">
          {t("pageSubtitle")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <a href={exportHref}>
          <Button testid="clients-export" type="default">
            <span className="inline-flex items-center gap-2">
              <FiDownload />
              {t("actions.export")}
            </span>
          </Button>
        </a>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void onImport(f);
            e.currentTarget.value = "";
          }}
        />

        <Button
          testid="clients-import"
          type="default"
          disabled={importing}
          onClick={() => fileRef.current?.click()}
        >
          <span className="inline-flex items-center gap-2">
            <FiUpload />
            {importing ? t("actions.importing") : t("actions.import")}
          </span>
        </Button>

        <Button testid="clients-add" type="primary" onClick={onNew}>
          <span className="inline-flex items-center gap-2">
            <FiPlus />
            {t("actions.add")}
          </span>
        </Button>
      </div>
    </header>
  );
}
