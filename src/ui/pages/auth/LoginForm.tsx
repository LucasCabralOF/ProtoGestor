"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { signIn } from "@/actions/authActions";
import { Alert, Button, Card, Form, Input, Password, Typography } from "@/ui/base";

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

  // Algumas APIs retornam { data: { error: { message }}} ou { data: { error: "..." } }
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
  const t = useTranslations("common");
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

      // 1) erros de validação do server (Zod no safe action)
      const fieldErrors = extractFieldErrors(result);
      if (fieldErrors) {
        form.setFields(
          Object.entries(fieldErrors)
            .filter(([, msgs]) => Array.isArray(msgs) && msgs.length > 0)
            .map(([name, msgs]) => ({
              name,
              errors: msgs,
            })),
        );
        return;
      }

      // 2) erro server
      const serverErr = extractServerError(result);
      if (serverErr) {
        setError(serverErr);
        return;
      }

      // 3) sucesso
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-(--color-base-3) p-6">
      <div className="w-full max-w-[420px]">
        <Card testid="login-card" variant="borderless" className="rounded-2xl">
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            {t("loginTitle")}
          </Typography.Title>

          {error ? (
            <div className="mb-3">
              <Alert testid="login-error" type="error" title={error} />
            </div>
          ) : null}

          <Form<LoginValues> form={form} layout="vertical" requiredMark={false} onFinish={onFinish}>
            <Form.Item
              name="email"
              label={t("email")}
              rules={[
                { required: true, message: "Informe seu email." },
                { type: "email", message: "Email inválido." },
              ]}
            >
              <Input testid="login-email" />
            </Form.Item>

            <Form.Item
              name="pass"
              label={t("password")}
              rules={[
                { required: true, message: "Informe sua senha." },
                { min: 8, message: "Senha deve ter no mínimo 8 caracteres." },
              ]}
            >
              <Password testid="login-password" />
            </Form.Item>

            <Button testid="login-submit" type="primary" loading={loading}>
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