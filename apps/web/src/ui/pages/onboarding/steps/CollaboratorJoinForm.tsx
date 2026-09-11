"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiArrowRight, FiBriefcase, FiUsers } from "react-icons/fi";
import { joinOrganizationAction } from "@/actions/onboardingActions";
import { Button } from "@/ui/base/Button";
import { Input } from "@/ui/base/Input";
import { useAppFeedback } from "@/ui/base/useAppFeedback";

type CollaboratorJoinFormProps = {
  onSwitchToOwner: () => void;
  userEmail: string | null;
};

export function CollaboratorJoinForm({
  onSwitchToOwner,
  userEmail,
}: CollaboratorJoinFormProps) {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const feedback = useAppFeedback();

  const [codeOrSlug, setCodeOrSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!codeOrSlug.trim()) {
      setError(t("collaborator.codeRequired"));
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await joinOrganizationAction({
        codeOrSlug: codeOrSlug.trim(),
      });

      if (!res?.data?.ok) {
        throw new Error(res?.serverError || t("collaborator.errorNotFound"));
      }

      feedback.notifySuccess(`Conectado à empresa ${res.data.name}!`);
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("collaborator.errorNotFound"),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-emerald-500 flex items-center gap-2">
        <FiUsers className="h-4 w-4 shrink-0" />
        <span>
          Você está se cadastrando como <strong>Colaborador de Campo</strong> (
          {userEmail}).
        </span>
      </div>

      <div>
        <span
          id="join-org-code-label"
          className="block text-sm font-semibold text-(--color-text) mb-1.5"
        >
          {t("collaborator.codeLabel")}
        </span>
        <Input
          aria-labelledby="join-org-code-label"
          testid="input-join-org"
          placeholder={t("collaborator.codePlaceholder")}
          value={codeOrSlug}
          onChange={(e) => {
            setCodeOrSlug(e.target.value);
            if (error) setError(null);
          }}
          className="w-full"
        />
        {error ? (
          <p className="mt-1.5 text-xs font-medium text-rose-500">{error}</p>
        ) : null}
      </div>

      <Button
        testid="button-join-org"
        type="primary"
        loading={loading}
        htmlType="submit"
        className="w-full"
      >
        <span className="inline-flex items-center gap-2">
          {loading ? t("collaborator.submitting") : t("collaborator.submit")}
          <FiArrowRight />
        </span>
      </Button>

      <div className="pt-2 border-t border-(--color-border) text-center">
        <button
          type="button"
          onClick={onSwitchToOwner}
          className="inline-flex items-center gap-1.5 text-xs text-blue-500 hover:underline"
        >
          <FiBriefcase className="h-3.5 w-3.5" />
          <span>{t("collaborator.switchToOwner")}</span>
        </button>
      </div>
    </form>
  );
}
