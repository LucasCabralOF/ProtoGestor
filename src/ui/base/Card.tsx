"use client";

import { Card as CardAntd, type CardProps } from "antd";

export function Card({
  className,
  children,
  title,
  extra,
  testid,
}: {
  className?: string;
  children?: React.ReactNode;
  title?: CardProps["title"];
  extra?: CardProps["extra"];
  testid?: string;
}) {
  return (
    <CardAntd
      className={className}
      data-testid={testid ? `card-${testid}` : undefined}
      extra={extra}
      title={title}
    >
      {children}
    </CardAntd>
  );
}
