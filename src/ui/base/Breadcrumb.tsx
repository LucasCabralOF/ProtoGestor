"use client";

import { Breadcrumb as BreadcrumbAntd, type BreadcrumbProps } from "antd";

export function Breadcrumb({
  className,
  items,
  testid,
}: {
  className?: string;
  items: BreadcrumbProps["items"];
  testid?: string;
}) {
  return (
    <div
      className={className}
      data-testid={testid ? `breadcrumb-${testid}` : undefined}
    >
      <BreadcrumbAntd items={items} />
    </div>
  );
}
