"use client";

import { Input as InputAntd, type InputProps } from "antd";

export function Input({
  className,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  allowClear = true,
  onChange,
  testid,
}: {
  className?: string;
  value?: InputProps["value"];
  defaultValue?: InputProps["defaultValue"];
  placeholder?: string;
  disabled?: boolean;
  allowClear?: boolean;
  onChange?: InputProps["onChange"];
  testid?: string;
}) {
  return (
    <InputAntd
      allowClear={allowClear}
      className={className}
      data-testid={testid ? `input-${testid}` : undefined}
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
    />
  );
}

export function Password({
  className,
  value,
  defaultValue,
  placeholder,
  disabled = false,
  onChange,
  testid,
}: {
  className?: string;
  value?: InputProps["value"];
  defaultValue?: InputProps["defaultValue"];
  placeholder?: string;
  disabled?: boolean;
  onChange?: InputProps["onChange"];
  testid?: string;
}) {
  return (
    <InputAntd.Password
      className={className}
      data-testid={testid ? `password-${testid}` : undefined}
      defaultValue={defaultValue}
      disabled={disabled}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
    />
  );
}
