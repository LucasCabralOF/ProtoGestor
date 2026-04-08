"use client";

import { Drawer as DrawerAntd, type DrawerProps } from "antd";

type DrawerSize = NonNullable<DrawerProps["size"]>;

export function Drawer({
  children,
  open,
  onClose,
  title,
  placement = "left",
  size = "default",
  testid,
}: {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  placement?: DrawerProps["placement"];
  size?: DrawerSize;
  testid?: string;
}) {
  return (
    <DrawerAntd
      destroyOnHidden={true}
      open={open}
      onClose={onClose}
      placement={placement}
      size={size}
      title={title}
      mask={{ closable: true }}
      styles={{
        header: {
          background: "var(--color-base-4)",
          borderBottom: "1px solid var(--color-border)",
          padding: "12px 16px",
        },
        body: {
          background: "var(--color-base-4)",
          padding: 0,
        },
        mask: {
          background: "rgba(0,0,0,0.35)",
        },
        section: {
          borderLeft:
            placement === "left" ? "1px solid var(--color-border)" : undefined,
          borderRight:
            placement === "right" ? "1px solid var(--color-border)" : undefined,
        },
      }}
      className="text-(--color-text-1)"
    >
      <div data-testid={testid ? `drawer-${testid}` : undefined}>
        {children}
      </div>
    </DrawerAntd>
  );
}
