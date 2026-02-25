// src/ui/base/Card.tsx
"use client";

import { Card as CardAntd, type CardProps } from "antd";
import type { ReactNode } from "react";

export function Card({
  className,
  children,
  title,
  extra,
  variant = "borderless",
  testid,
  bodyStyle,
  style,
}: {
  className?: string;
  children?: ReactNode;
  title?: CardProps["title"];
  extra?: CardProps["extra"];
  variant?: CardProps["variant"];
  testid?: string;
  bodyStyle?: CardProps["bodyStyle"];
  style?: CardProps["style"];
}) {
  return (
    <CardAntd
      className={className}
      style={style}
      bodyStyle={bodyStyle}
      data-testid={testid ? `card-${testid}` : undefined}
      extra={extra}
      title={title}
      variant={variant}
    >
      {children}
    </CardAntd>
  );
}
