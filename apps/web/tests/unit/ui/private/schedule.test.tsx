// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScheduleFilters } from "@/ui/pages/privatePages/schedule-components/ScheduleFilters";
import { ScheduleHeader } from "@/ui/pages/privatePages/schedule-components/ScheduleHeader";
import { ScheduleKpis } from "@/ui/pages/privatePages/schedule-components/ScheduleKpis";

afterEach(() => {
  cleanup();
});

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("ScheduleHeader", () => {
  it("renderiza título, subtítulo e dispara callback onNew", () => {
    const onNew = vi.fn();
    render(<ScheduleHeader onNew={onNew} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onNew).toHaveBeenCalledTimes(1);
  });
});

describe("ScheduleKpis", () => {
  it("renderiza os 4 contadores de KPIs da agenda", () => {
    const kpis = {
      total: 10,
      today: 3,
      scheduled: 5,
      done: 4,
      canceled: 1,
    };

    render(<ScheduleKpis kpis={kpis} />);

    expect(screen.getByText("3")).toBeDefined();
    expect(screen.getByText("5")).toBeDefined();
    expect(screen.getByText("4")).toBeDefined();
    expect(screen.getByText("1")).toBeDefined();
  });
});

describe("ScheduleFilters", () => {
  it("permite busca textual e seleção de filtros disparando onParamChange", () => {
    const onParamChange = vi.fn();
    const customerOptions = [
      { id: "cust-1", name: "Cliente Alpha" },
      { id: "cust-2", name: "Cliente Beta" },
    ];

    render(
      <ScheduleFilters
        q="test search"
        status="scheduled"
        customerId="cust-1"
        customerOptions={customerOptions}
        onParamChange={onParamChange}
      />,
    );

    const input = screen.getByDisplayValue("test search");
    fireEvent.change(input, { target: { value: "novo termo" } });
    expect(onParamChange).toHaveBeenCalledWith("q", "novo termo");

    const statusSelect = screen.getByDisplayValue("filters.scheduled");
    fireEvent.change(statusSelect, { target: { value: "done" } });
    expect(onParamChange).toHaveBeenCalledWith("status", "done");

    const customerSelect = screen.getByDisplayValue("Cliente Alpha");
    fireEvent.change(customerSelect, { target: { value: "cust-2" } });
    expect(onParamChange).toHaveBeenCalledWith("customerId", "cust-2");
  });
});
