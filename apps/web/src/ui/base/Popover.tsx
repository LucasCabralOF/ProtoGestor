"use client";

import { Popover as PopoverAntd, type PopoverProps } from "antd";
import type { ReactNode } from "react";
import { useState } from "react";

export function Popover({
  className,
  content,
  children,
  disabled,
  title,
  open,
  onOpenChange,
  triggerClick = true,
  triggerHover = false,
  placement = "bottom",
}: {
  className?: string;
  content: (closePopover: () => void) => ReactNode;
  children: ReactNode;
  disabled?: boolean;
  title?: ReactNode;
  open?: boolean;
  onOpenChange?: (
    shouldOpen: boolean,
    setOpenPopover: (open: boolean) => void,
  ) => void;
  triggerClick?: boolean;
  triggerHover?: boolean;
  placement?: PopoverProps["placement"];
}) {
  const [openPopover, setOpenPopover] = useState(false);

  const trigger: PopoverProps["trigger"] = [];

  if (triggerClick) {
    trigger.push("click");
  }

  if (triggerHover) {
    trigger.push("hover");
  }

  return (
    <PopoverAntd
      arrow={false}
      autoAdjustOverflow={true}
      classNames={{ container: "p-0! rounded-md! shadow-md!" }}
      content={
        <div className="flex flex-col rounded-md border border-(--color-border)">
          {content(() => setOpenPopover(false))}
        </div>
      }
      destroyOnHidden={true}
      onOpenChange={(shouldOpen) => {
        if (!disabled) {
          setOpenPopover(shouldOpen);
        }

        onOpenChange?.(shouldOpen, setOpenPopover);
      }}
      open={disabled ? false : (open ?? openPopover)}
      placement={placement}
      title={title}
      trigger={trigger}
    >
      <div className={`flex flex-col ${className}`}>{children}</div>
    </PopoverAntd>
  );
}
