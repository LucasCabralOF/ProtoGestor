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
      className={className}
      danger={danger}
      data-testid={testid ? `button-${testid}` : undefined}
      disabled={disabled}
      htmlType={htmlType}
      loading={loading}
      onClick={onClick}
      shape={shape}
      type={type}
      block={!fit}
    >
      {children}
    </ButtonAntd>
  );
}
