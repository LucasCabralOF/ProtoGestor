"use client";

import { Alert as AlertAntd, type AlertProps } from "antd";

export function Alert({
  className,
  description,
  type = "info",
  showIcon = true,
  testid,
}: {
  className?: string;
  description?: AlertProps["description"];
  type?: AlertProps["type"];
  showIcon?: boolean;
  testid?: string;
}) {
  return (
    <AlertAntd
      className={className}
      data-testid={testid ? `alert-${testid}` : undefined}
      description={description}
      showIcon={showIcon}
      type={type}
    />
  );
}
