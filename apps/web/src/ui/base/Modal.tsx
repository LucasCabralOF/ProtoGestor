"use client";

import { Modal as ModalAntd, type ModalProps } from "antd";
import type { ReactNode } from "react";

export function Modal({
  children,
  destroyOnClose = true,
  footer = null,
  onCancel,
  open,
  testid,
  title,
  width = 520,
}: {
  children: ReactNode;
  destroyOnClose?: boolean;
  footer?: ModalProps["footer"];
  onCancel?: () => void;
  open: boolean;
  testid?: string;
  title?: ReactNode;
  width?: number | string;
}) {
  return (
    <ModalAntd
      destroyOnHidden={destroyOnClose}
      footer={footer}
      onCancel={onCancel}
      open={open}
      title={title}
      width={width}
      styles={{
        container: {
          background: "var(--color-base-1)",
          border: "1px solid var(--color-border)",
          borderRadius: "1rem",
          color: "var(--color-text)",
        },
        header: {
          background: "transparent",
          borderBottom: "1px solid var(--color-border)",
          paddingBottom: "12px",
          color: "var(--color-text)",
        },
        body: {
          color: "var(--color-text)",
        },
        mask: {
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
        },
      }}
      wrapClassName="app-modal-wrapper"
    >
      <div data-testid={testid ? `modal-${testid}` : undefined}>{children}</div>
    </ModalAntd>
  );
}
