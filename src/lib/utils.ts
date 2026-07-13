import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(ms: number | null): string {
  if (ms === null) return "-";
  if (ms < 1000) return `${ms}ms`;
  const seconds = (ms / 1000).toFixed(1);
  return `${seconds}s`;
}

export function formatDateTime(date: unknown): string {
  if (!date) return "-";
  
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (date && typeof date === "object" && "toDate" in date && typeof (date as { toDate: unknown }).toDate === "function") {
    d = (date as { toDate: () => Date }).toDate();
  } else {
    d = new Date(date as string | number);
  }
  
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
