import {
  jalaaliMonthLength,
  jalaaliToDateObject,
  jalaaliWeek,
  toGregorian,
  toJalaali,
} from "jalaali-js";

export type JalaliDateParts = {
  jy: number;
  jm: number;
  jd: number;
};

export const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

export const PERSIAN_WEEKDAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
] as const;

export const PERSIAN_WEEKDAYS_SHORT = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const;

/** Saturday = 0 in Jalali week convention used by this library */
export function gregorianToWeekday(date: Date): number {
  const jsDay = date.getDay();
  return (jsDay + 1) % 7;
}

export function toJalali(date: Date): JalaliDateParts {
  const { jy, jm, jd } = toJalaali(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
  return { jy, jm, jd };
}

export function fromJalali(parts: JalaliDateParts): Date {
  const { gy, gm, gd } = toGregorian(parts.jy, parts.jm, parts.jd);
  return new Date(gy, gm - 1, gd);
}

export function formatJalali(
  date: Date,
  options: { includeWeekday?: boolean; latinDigits?: boolean } = {},
): string {
  const { jy, jm, jd } = toJalali(date);
  const month = PERSIAN_MONTHS[jm - 1];
  let text = `${jd} ${month} ${jy}`;

  if (options.includeWeekday) {
    const weekday = PERSIAN_WEEKDAYS[gregorianToWeekday(date)];
    text = `${weekday}، ${text}`;
  }

  if (options.latinDigits) {
    text = toLatinDigits(text);
  } else {
    text = toPersianDigits(text);
  }

  return text;
}

export function formatTime(date: Date, latinDigits = true): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  const text = `${h}:${m}`;
  return latinDigits ? text : toPersianDigits(text);
}

export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

export function toPersianDigits(value: string): string {
  return value.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function isoDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function localDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getJalaliMonthGrid(jy: number, jm: number): (Date | null)[] {
  const daysInMonth = jalaaliMonthLength(jy, jm);
  const firstDay = jalaaliToDateObject(jy, jm, 1);
  const startWeekday = gregorianToWeekday(firstDay);
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(jalaaliToDateObject(jy, jm, d));
  }

  return cells;
}

export function getJalaliWeekDates(jy: number, jm: number, jd: number): Date[] {
  const { saturday } = jalaaliWeek(jy, jm, jd);
  const start = jalaaliToDateObject(saturday.jy, saturday.jm, saturday.jd);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
}

export function addJalaliMonths(
  jy: number,
  jm: number,
  delta: number,
): JalaliDateParts {
  const monthIndex = jy * 12 + (jm - 1) + delta;
  const nextJy = Math.floor(monthIndex / 12);
  const nextJm = (monthIndex % 12) + 1;
  return { jy: nextJy, jm: nextJm, jd: 1 };
}

export function monthDateRange(jy: number, jm: number): { from: Date; to: Date } {
  const from = jalaaliToDateObject(jy, jm, 1);
  const to = jalaaliToDateObject(jy, jm, jalaaliMonthLength(jy, jm));
  to.setHours(23, 59, 59, 999);
  return { from, to };
}
