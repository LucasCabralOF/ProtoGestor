"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { slugifyOrganizationName } from "@/lib/org-slug";
import { Button } from "@/ui/base/Button";
import { Form } from "@/ui/base/Form";
import { Input } from "@/ui/base/Input";
import {
  ONBOARDING_SEGMENT_IDS,
  type OnboardingStep1Data,
  validateStep1,
} from "../onboarding-utils";

export function Step1Form({
  initial,
  userEmail,
  onNext,
}: {
  initial: Partial<OnboardingStep1Data>;
  userEmail: string | null;
  onNext: (name: string, segment: string) => void;
}) {
  const t = useTranslations("onboarding");

  const [form] = Form.useForm<{ name: string }>();
  const nameValue = Form.useWatch("name", form) ?? initial.name ?? "";

  const [segment, setSegment] = useState(initial.segment ?? "");
  const [segmentTouched, setSegmentTouched] = useState(false);
  const segmentError = segmentTouched && !segment;

  const slugPreview =
    nameValue.trim().length >= 2 ? slugifyOrganizationName(nameValue) : null;

  async function handleSubmit(values: { name: string }) {
    setSegmentTouched(true);
    const errors = validateStep1({ name: values.name, segment });
    if (errors.length > 0) return;
    onNext(values.name.trim(), segment);
  }

  return (
    <Form<{ name: string }>
      form={form}
      layout="vertical"
      requiredMark={false}
      initialValues={{ name: initial.name ?? "" }}
      onFinish={handleSubmit}
    >
      {userEmail ? (
        <p className="mb-5 text-sm text-(--color-text-2)">
          {t("step1.signedAs", { email: userEmail })}
        </p>
      ) : null}

      <Form.Item
        name="name"
        label={t("step1.nameLabel")}
        rules={[
          { required: true, message: t("step1.nameRequired") },
          { min: 2, message: t("step1.nameMin") },
        ]}
      >
        <Input
          testid="onboarding-org-name"
          placeholder={t("step1.namePlaceholder")}
        />
      </Form.Item>

      <div className="mb-4 rounded-2xl border border-dashed border-(--color-border) bg-(--color-base-2) p-3 text-sm">
        <p className="font-medium text-(--color-text-2)">
          {t("step1.slugPreviewLabel")}
        </p>
        <p className="mt-1 font-mono text-xs text-(--color-text-2)">
          {slugPreview ?? t("step1.slugPreviewEmpty")}
        </p>
      </div>

      <div className="mb-5">
        <label
          htmlFor="onboarding-segment"
          className="mb-1.5 block text-sm font-medium text-(--color-text-1)"
        >
          {t("step1.segmentLabel")}
        </label>
        <select
          id="onboarding-segment"
          data-testid="onboarding-segment"
          value={segment}
          onChange={(e) => {
            setSegment(e.target.value);
            setSegmentTouched(true);
          }}
          className="w-full rounded-lg border border-(--color-border) bg-(--color-base-1) px-3 py-2 text-sm text-(--color-text-1) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
        >
          <option value="" disabled>
            {t("step1.segmentPlaceholder")}
          </option>
          {ONBOARDING_SEGMENT_IDS.map((id) => (
            <option key={id} value={id}>
              {t(`step1.segments.${id}`)}
            </option>
          ))}
        </select>
        {segmentError ? (
          <p className="mt-1 text-xs text-red-500">
            {t("step1.segmentRequired")}
          </p>
        ) : null}
      </div>

      <Button testid="onboarding-next-step1" type="primary" htmlType="submit">
        <span className="inline-flex items-center gap-2">
          {t("steps.next")}
          <FiArrowRight size={14} />
        </span>
      </Button>
    </Form>
  );
}
