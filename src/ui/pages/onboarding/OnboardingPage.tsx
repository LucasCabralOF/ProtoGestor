"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiUsers,
} from "react-icons/fi";
import { createOrganizationAction } from "@/actions/onboardingActions";
import { slugifyOrganizationName } from "@/lib/org-slug";
import { Alert } from "@/ui/base/Alert";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Form } from "@/ui/base/Form";
import { Input } from "@/ui/base/Input";
import { Typography } from "@/ui/base/Typography";

type OnboardingValues = {
  name: string;
};

function extractFieldErrors(value: unknown): Record<string, string[]> | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  const validationErrors = v.validationErrors as unknown;
  if (!validationErrors || typeof validationErrors !== "object") return null;
  const ve = validationErrors as Record<string, unknown>;
  const fieldErrors = ve.fieldErrors as unknown;
  if (!fieldErrors || typeof fieldErrors !== "object") return null;
  return fieldErrors as Record<string, string[]>;
}

function extractServerError(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;

  const serverError = v.serverError;
  if (typeof serverError === "string" && serverError) return serverError;

  const data = v.data as unknown;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    const err = d.error as unknown;

    if (typeof err === "string" && err) return err;

    if (err && typeof err === "object") {
      const e = err as Record<string, unknown>;
      const msg = e.message;
      if (typeof msg === "string" && msg) return msg;
    }
  }

  return null;
}

export function OnboardingPage({
  userEmail,
  userName,
}: {
  userEmail: string | null;
  userName: string;
}) {
  const t = useTranslations("onboarding");
  const router = useRouter();
  const [form] = Form.useForm<OnboardingValues>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const organizationName = Form.useWatch("name", form) ?? "";

  const slugPreview = useMemo(() => {
    if (organizationName.trim().length === 0) return null;
    return slugifyOrganizationName(organizationName);
  }, [organizationName]);

  async function onFinish(values: OnboardingValues) {
    setError(null);
    setLoading(true);

    try {
      const result = await createOrganizationAction({
        name: values.name,
      });

      const fieldErrors = extractFieldErrors(result);
      if (fieldErrors) {
        form.setFields(
          Object.entries(fieldErrors)
            .filter(
              ([key, messages]) =>
                key === "name" &&
                Array.isArray(messages) &&
                messages.length > 0,
            )
            .map(([key, messages]) => ({
              errors: messages,
              name: key as keyof OnboardingValues,
            })),
        );
        return;
      }

      const serverError = extractServerError(result);
      if (serverError) {
        setError(serverError);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-(--color-base-3) text-(--color-text-1)">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10">
        <div className="grid w-full gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="flex flex-col justify-center gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-(--color-border) bg-(--color-base-1) px-4 py-2 text-sm text-(--color-text-2)">
              <FiBriefcase />
              {t("badge")}
            </div>

            <div className="max-w-2xl">
              <Typography.Title level={1} style={{ marginBottom: 12 }}>
                {t("title", { userName })}
              </Typography.Title>
              <p className="text-lg text-(--color-text-2)">{t("subtitle")}</p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-3xl border border-(--color-border) bg-(--color-base-1) p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
                    <FiUsers />
                  </div>
                  <div>
                    <p className="font-semibold">{t("benefits.ownerTitle")}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {t("benefits.ownerDescription")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-(--color-border) bg-(--color-base-1) p-5">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl border border-(--color-border) bg-(--color-base-2) p-3">
                    <FiCheckCircle />
                  </div>
                  <div>
                    <p className="font-semibold">{t("benefits.tenantTitle")}</p>
                    <p className="mt-1 text-sm text-(--color-text-2)">
                      {t("benefits.tenantDescription")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <Card
              testid="onboarding-card"
              className="rounded-3xl border border-(--color-border)"
            >
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-(--color-text-2)">
                    {t("form.eyebrow")}
                  </p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight">
                    {t("form.title")}
                  </h2>
                  <p className="mt-2 text-(--color-text-2)">
                    {t("form.subtitle")}
                  </p>
                  {userEmail ? (
                    <p className="mt-3 text-sm text-(--color-text-2)">
                      {t("form.signedAs", { email: userEmail })}
                    </p>
                  ) : null}
                </div>

                {error ? (
                  <Alert testid="onboarding-error" title={error} type="error" />
                ) : null}

                <Form<OnboardingValues>
                  form={form}
                  layout="vertical"
                  requiredMark={false}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="name"
                    label={t("form.nameLabel")}
                    rules={[
                      { required: true, message: t("form.nameRequired") },
                      { min: 2, message: t("form.nameMin") },
                    ]}
                  >
                    <Input
                      testid="onboarding-org-name"
                      placeholder={t("form.namePlaceholder")}
                    />
                  </Form.Item>

                  <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-base-2) p-4 text-sm">
                    <p className="font-semibold">
                      {t("form.slugPreviewLabel")}
                    </p>
                    <p className="mt-1 text-(--color-text-2)">
                      {slugPreview ?? t("form.slugPreviewEmpty")}
                    </p>
                  </div>

                  <div className="mt-6">
                    <Button
                      testid="onboarding-submit"
                      type="primary"
                      loading={loading}
                      htmlType="submit"
                    >
                      <span className="inline-flex items-center gap-2">
                        {loading ? t("form.submitting") : t("form.submit")}
                        <FiArrowRight />
                      </span>
                    </Button>
                  </div>
                </Form>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
