"use client";

import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { SVGRenderer } from "echarts/renderers";
import type { EChartsOption } from "echarts/types/dist/shared";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

echarts.use([
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  BarChart,
  LineChart,
  PieChart,
  SVGRenderer,
]);

export function EChart({
  ariaLabel,
  className,
  height = 280,
  option,
}: {
  ariaLabel: string;
  className?: string;
  height?: number;
  option: EChartsOption;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.EChartsType | null>(null);

  useEffect(() => {
    const element = rootRef.current;

    if (!element) return;

    const chart = echarts.init(element, undefined, {
      renderer: "svg",
    });

    chartRef.current = chart;

    const resize = () => chart.resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(element);
    window.addEventListener("beforeprint", resize);
    window.addEventListener("afterprint", resize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("beforeprint", resize);
      window.removeEventListener("afterprint", resize);
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) return;

    chart.setOption(option, {
      lazyUpdate: true,
      notMerge: true,
    });
    chart.resize();
  }, [option]);

  const style: CSSProperties = {
    height,
  };

  return (
    <div
      aria-label={ariaLabel}
      className={className}
      ref={rootRef}
      role="img"
      style={style}
    />
  );
}
