// src/ui/base/Card.tsx
"use client";

import type { ReactNode } from "react";
import { Card as CardAntd, type CardProps } from "antd";

export function Card({
  className,
  children,
  title,
  extra,
  variant = "borderless",
  testid,
  style,
  styles,
  classNames,
}: {
  className?: string;
  children?: ReactNode;
  title?: CardProps["title"];
  extra?: CardProps["extra"];
  variant?: CardProps["variant"];
  testid?: string;
  style?: CardProps["style"];
  styles?: CardProps["styles"];
  classNames?: CardProps["classNames"];
}) {
  return (
    <CardAntd
      className={className}
      style={style}
      styles={styles}
      classNames={classNames}
      data-testid={testid ? `card-${testid}` : undefined}
      extra={extra}
      title={title}
      variant={variant}
    >
      {children}
    </CardAntd>
  );
}