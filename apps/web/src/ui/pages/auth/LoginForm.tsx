// src/ui/pages/auth/LoginForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { FiShield } from "react-icons/fi";
import { signIn } from "@/actions/authActions";
import { Alert } from "@/ui/base/Alert";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Form } from "@/ui/base/Form";
import { Input, Password } from "@/ui/base/Input";
import { Typography } from "@/ui/base/Typography";

type LoginValues = {
  email: string;
  pass: string;
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

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [form] = Form.useForm<LoginValues>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFinish(values: LoginValues) {
    setError(null);
    setLoading(true);

    try {
      const result = await signIn({
        email: values.email,
        pass: values.pass,
        callbackURL: "/dashboard",
      });

      const fieldErrors = extractFieldErrors(result);
      if (fieldErrors) {
        const allowed: (keyof LoginValues)[] = ["email", "pass"];

        form.setFields(
          Object.entries(fieldErrors)
            .filter(
              ([k, msgs]) =>
                allowed.includes(k as keyof LoginValues) &&
                Array.isArray(msgs) &&
                msgs.length > 0,
            )
            .map(([k, msgs]) => ({
              name: k as keyof LoginValues,
              errors: msgs,
            })),
        );
        return;
      }

      const serverErr = extractServerError(result);
      if (serverErr) {
        setError(serverErr);
        return;
      }

      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-(--color-base-3) p-6">
      <div className="w-full max-w-[420px]">
        <Card testid="login-card" variant="borderless" className="rounded-2xl">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <FiShield className="h-3.5 w-3.5" />
            <span>Confiança Gestor • Gestão Operacional</span>
          </div>

          <Typography.Title
            level={3}
            style={{ marginTop: 0, marginBottom: 12 }}
          >
            {t("loginTitle")}
          </Typography.Title>

          <button
            type="button"
            data-testid="button-quick-fill-demo"
            onClick={() => {
              form.setFieldsValue({
                email: "demo@local.dev",
                pass: "Demo@1234",
              });
            }}
            className="mb-4 w-full flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 transition"
          >
            <span>
              Acesso Rápido: <strong>Conta Demo</strong>
            </span>
            <span className="font-semibold underline">Preencher</span>
          </button>

          {error ? (
            <div className="mb-3">
              <Alert testid="login-error" type="error" title={error} />
            </div>
          ) : null}

          <Form<LoginValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              label={t("email")}
              rules={[
                { required: true, message: t("emailRequired") },
                { type: "email", message: t("emailInvalid") },
              ]}
            >
              <Input testid="login-email" />
            </Form.Item>

            <Form.Item
              name="pass"
              label={t("password")}
              rules={[
                { required: true, message: t("passwordRequired") },
                { min: 8, message: t("passwordMin") },
              ]}
            >
              <Password testid="login-password" />
            </Form.Item>

            <Button
              testid="login-submit"
              type="primary"
              loading={loading}
              htmlType="submit"
            >
              {t("enter")}
            </Button>
          </Form>

          <div className="mt-4 text-sm text-(--color-text-2)">
            <a href="/signup" className="underline">
              {t("noAccount")}
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
