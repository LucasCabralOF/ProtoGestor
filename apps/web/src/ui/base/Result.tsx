"use client";

import { Result as ResultAntd, type ResultProps } from "antd";

export function Result({
  className,
  extra,
  icon,
  status,
  subTitle,
  testid,
  title,
}: {
  className?: string;
  extra?: ResultProps["extra"];
  icon?: ResultProps["icon"];
  status: ResultProps["status"];
  subTitle?: ResultProps["subTitle"];
  testid?: string;
  title?: ResultProps["title"];
}) {
  return (
    <ResultAntd
      className={className}
      data-testid={testid ? `result-${testid}` : undefined}
      extra={extra}
      icon={icon}
      status={status}
      subTitle={subTitle}
      title={title}
    />
  );
}
