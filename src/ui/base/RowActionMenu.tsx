"use client";

import type { ReactNode } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { Popover } from "@/ui/base/Popover";

type RowActionItem = {
  danger?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  key: string;
  label: ReactNode;
  onSelect: () => void;
};

export function RowActionMenu({
  items,
  label = "Ações",
  minWidthClassName = "min-w-52",
}: {
  items: RowActionItem[];
  label?: string;
  minWidthClassName?: string;
}) {
  const visibleItems = items.filter((item) => !item.disabled);

  return (
    <Popover
      disabled={visibleItems.length === 0}
      placement="bottomRight"
      content={(close) => (
        <div
          className={`${minWidthClassName} overflow-hidden rounded-xl bg-(--color-base-1)`}
        >
          {visibleItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-(--color-base-2) ${
                item.danger ? "text-rose-400" : ""
              }`}
              onClick={() => {
                close();
                item.onSelect();
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    >
      <button
        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-(--color-border) bg-(--color-base-1) hover:bg-(--color-base-2)"
        title={label}
        type="button"
      >
        <FiMoreVertical />
      </button>
    </Popover>
  );
}
