"use client";

import { Button as ButtonAntd, type ButtonProps } from "antd";

export function Button({
  className,
  children,
  onClick,
  type = "default",
  shape = "default",
  disabled = false,
  loading = false,
  danger = false,
  fit = false,
  testid,
  htmlType = "button",
}: {
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  type?: ButtonProps["type"];
  shape?: ButtonProps["shape"];
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
  fit?: boolean;
  testid?: string;
  htmlType?: ButtonProps["htmlType"];
}) {
  return (
    <ButtonAntd
      classNames={{
        root: `!flex !min-h-fit !items-center ${fit ? "!w-fit" : "!w-full"}`,
      }}
      danger={danger}
      data-testid={testid ? `button-${testid}` : undefined}
      disabled={disabled}
      htmlType={htmlType}
      loading={loading}
      onClick={onClick}
      shape={shape}
      type={type}
    >
      <div
        className={`flex h-7 min-h-7 w-full items-center justify-center gap-2 ${className ?? ""}`}
      >
        {children}
      </div>
    </ButtonAntd>
  );
}
