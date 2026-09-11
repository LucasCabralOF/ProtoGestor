"use client";

import { Input as InputAntd, type InputProps } from "antd";

export function Input({
  testid,
  ...props
}: InputProps & {
  testid?: string;
}) {
  return (
    <InputAntd
      data-testid={testid ? `input-${testid}` : undefined}
      {...props}
    />
  );
}

export function Password({
  testid,
  ...props
}: InputProps & {
  testid?: string;
}) {
  return (
    <InputAntd.Password
      data-testid={testid ? `password-${testid}` : undefined}
      {...props}
    />
  );
}
