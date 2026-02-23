// src/ui/pages/auth/SignupForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { signUp } from "@/actions/authActions";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Password,
  Typography,
} from "@/ui/base";

type SignupValues = {
  name: string;
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

export function SignupForm() {
  const t = useTranslations("common");
  const router = useRouter();

  const [form] = Form.useForm<SignupValues>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFinish(values: SignupValues) {
    setError(null);
    setLoading(true);

    try {
      const result = await signUp({
        name: values.name,
        email: values.email,
        pass: values.pass,
        callbackURL: "/dashboard",
      });

      const fieldErrors = extractFieldErrors(result);
      if (fieldErrors) {
        const allowed: (keyof SignupValues)[] = ["name", "email", "pass"];

        form.setFields(
          Object.entries(fieldErrors)
            .filter(
              ([k, msgs]) =>
                allowed.includes(k as keyof SignupValues) &&
                Array.isArray(msgs) &&
                msgs.length > 0,
            )
            .map(([k, msgs]) => ({
              name: k as keyof SignupValues,
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
        <Card testid="signup-card" variant="borderless" className="rounded-2xl">
          <Typography.Title level={3} style={{ marginTop: 0 }}>
            {t("signupTitle")}
          </Typography.Title>

          {error ? (
            <div className="mb-3">
              <Alert testid="signup-error" type="error" title={error} />
            </div>
          ) : null}

          <Form<SignupValues>
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label={t("name")}
              rules={[{ required: true, message: "Informe seu nome." }]}
            >
              <Input testid="signup-name" />
            </Form.Item>

            <Form.Item
              name="email"
              label={t("email")}
              rules={[
                { required: true, message: "Informe seu email." },
                { type: "email", message: "Email inválido." },
              ]}
            >
              <Input testid="signup-email" />
            </Form.Item>

            <Form.Item
              name="pass"
              label={t("password")}
              rules={[
                { required: true, message: "Informe sua senha." },
                { min: 8, message: "Senha deve ter no mínimo 8 caracteres." },
              ]}
            >
              <Password testid="signup-password" />
            </Form.Item>

            <Button testid="signup-submit" type="primary" loading={loading} htmlType="submit">
              {t("createAccount")}
            </Button>
          </Form>

          <div className="mt-4 text-sm text-(--color-text-2)">
            <a href="/login" className="underline">
              {t("hasAccount")}
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
