const rtf = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });

/** Latin number → Persian digits with grouping, e.g. ۱٬۳۴۲ */
export const faNum = (n: number | null | undefined): string =>
  Number(n ?? 0).toLocaleString("fa-IR");

/** "۱۲ دقیقه پیش" / "۲ ساعت پیش" for a past ISO date */
export function relTimeFa(iso: string | null | undefined): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const delta = Math.round((then - Date.now()) / 1000); // seconds, negative in past
  const abs = Math.abs(delta);
  if (abs < 60) return rtf.format(Math.trunc(delta), "second");
  if (abs < 3600) return rtf.format(Math.trunc(delta / 60), "minute");
  if (abs < 86400) return rtf.format(Math.trunc(delta / 3600), "hour");
  return rtf.format(Math.trunc(delta / 86400), "day");
}

/** ISO date → Persian full date+time for tooltips */
export function faDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

/** lastRun + cadence → estimated next run */
export function nextRunFrom(lastRun: string | null | undefined, everyHours: number): string | null {
  if (!lastRun) return null;
  const t = new Date(lastRun).getTime();
  if (Number.isNaN(t)) return null;
  return new Date(t + everyHours * 3600 * 1000).toISOString();
}
