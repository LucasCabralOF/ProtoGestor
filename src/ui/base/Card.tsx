"use client";

import { Card as CardAntd, type CardProps } from "antd";

export function Card({
  className,
  children,
  title,
  extra,
  variant = "borderless",
  testid,
}: {
  className?: string;
  children?: React.ReactNode;
  title?: CardProps["title"];
  extra?: CardProps["extra"];
  variant?: CardProps["variant"];
  testid?: string;
}) {
  return (
    <CardAntd
      className={className}
      data-testid={testid ? `card-${testid}` : undefined}
      extra={extra}
      title={title}
      variant={variant}
    >
      {children}
    </CardAntd>
  );
}
