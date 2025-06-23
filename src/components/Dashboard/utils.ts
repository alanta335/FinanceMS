import { MetricChange } from "./types";

export function getChange(current: number, prev: number, isPercent = false): MetricChange {
  if (prev === 0) {
    return { value: "+0%", type: "neutral" };
  }
  const diff = current - prev;
  const percent = (diff / Math.abs(prev)) * 100;
  const rounded = percent.toFixed(1);
  const sign = percent > 0 ? "+" : "";
  return {
    value: `${sign}${rounded}${isPercent ? "" : "%"}${isPercent ? "%" : ""}`,
    type: percent > 0 ? "positive" : percent < 0 ? "negative" : "neutral",
  };
}
