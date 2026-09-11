"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiBriefcase, FiCheck, FiUsers } from "react-icons/fi";

import { signUp } from "@/actions/authActions";
import { Alert } from "@/ui/base/Alert";
import { Button } from "@/ui/base/Button";
import { Card } from "@/ui/base/Card";
import { Form } from "@/ui/base/Form";
import { Input, Password } from "@/ui/base/Input";
import { Typography } from "@/ui/base/Typography";

type SignupValues = {
  name: string;
  email: string;
  pass: string;
};

type UserRoleChoice = "owner" | "member";

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
  const t = useTranslations("auth");
  const router = useRouter();

  const [form] = Form.useForm<SignupValues>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<UserRoleChoice>("owner");

  async function onFinish(values: SignupValues) {
    setError(null);
    setLoading(true);

    try {
      const callbackURL =
        role === "member" ? "/onboarding?role=member" : "/onboarding";
      const result = await signUp({
        name: values.name,
        email: values.email,
        pass: values.pass,
        callbackURL,
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

      router.push(callbackURL);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-(--color-base-3) p-6">
      <div className="w-full max-w-[460px]">
        <Card testid="signup-card" variant="borderless" className="rounded-2xl">
          <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>
            {t("signupTitle")}
          </Typography.Title>
          <p className="mb-5 text-sm text-(--color-text-2)">{t("roleTitle")}</p>

          {/* Role selector */}
          <div className="mb-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                role === "owner"
                  ? "border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30"
                  : "border-(--color-border) bg-(--color-base-2) hover:border-(--color-border-hover)"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-500">
                  <FiBriefcase className="h-4 w-4" />
                </div>
                {role === "owner" && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-white text-[10px]">
                    <FiCheck />
                  </span>
                )}
              </div>
              <span className="mt-2.5 text-xs font-bold text-(--color-text)">
                {t("roleOwner")}
              </span>
              <span className="mt-1 text-[11px] text-(--color-text-2) leading-tight">
                {t("roleOwnerDesc")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRole("member")}
              className={`flex flex-col text-left p-3.5 rounded-xl border transition-all ${
                role === "member"
                  ? "border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                  : "border-(--color-border) bg-(--color-base-2) hover:border-(--color-border-hover)"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-500">
                  <FiUsers className="h-4 w-4" />
                </div>
                {role === "member" && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
                    <FiCheck />
                  </span>
                )}
              </div>
              <span className="mt-2.5 text-xs font-bold text-(--color-text)">
                {t("roleMember")}
              </span>
              <span className="mt-1 text-[11px] text-(--color-text-2) leading-tight">
                {t("roleMemberDesc")}
              </span>
            </button>
          </div>

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
              rules={[{ required: true, message: t("nameRequired") }]}
            >
              <Input testid="signup-name" />
            </Form.Item>

            <Form.Item
              name="email"
              label={t("email")}
              rules={[
                { required: true, message: t("emailRequired") },
                { type: "email", message: t("emailInvalid") },
              ]}
            >
              <Input testid="signup-email" />
            </Form.Item>

            <Form.Item
              name="pass"
              label={t("password")}
              rules={[
                { required: true, message: t("passwordRequired") },
                { min: 8, message: t("passwordMin") },
              ]}
            >
              <Password testid="signup-password" />
            </Form.Item>

            <Button
              testid="signup-submit"
              type="primary"
              loading={loading}
              htmlType="submit"
            >
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
