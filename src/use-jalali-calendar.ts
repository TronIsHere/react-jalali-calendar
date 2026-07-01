import { useCallback, useMemo, useState } from "react";
import {
  addJalaliMonths,
  getJalaliMonthGrid,
  localDateKey,
  toJalali,
  type JalaliDateParts,
} from "./core";

export type UseJalaliCalendarOptions = {
  initialMonth?: Pick<JalaliDateParts, "jy" | "jm">;
};

export function useJalaliCalendar(options: UseJalaliCalendarOptions = {}) {
  const today = useMemo(() => toJalali(new Date()), []);
  const [jy, setJy] = useState(options.initialMonth?.jy ?? today.jy);
  const [jm, setJm] = useState(options.initialMonth?.jm ?? today.jm);

  const grid = useMemo(() => getJalaliMonthGrid(jy, jm), [jy, jm]);
  const todayKey = useMemo(() => localDateKey(new Date()), []);

  const goToMonth = useCallback((nextJy: number, nextJm: number) => {
    setJy(nextJy);
    setJm(nextJm);
  }, []);

  const prevMonth = useCallback(() => {
    const prev = addJalaliMonths(jy, jm, -1);
    goToMonth(prev.jy, prev.jm);
  }, [goToMonth, jy, jm]);

  const nextMonth = useCallback(() => {
    const next = addJalaliMonths(jy, jm, 1);
    goToMonth(next.jy, next.jm);
  }, [goToMonth, jy, jm]);

  const goToToday = useCallback(() => {
    goToMonth(today.jy, today.jm);
  }, [goToMonth, today.jm, today.jy]);

  return {
    jy,
    jm,
    grid,
    today,
    todayKey,
    prevMonth,
    nextMonth,
    goToMonth,
    goToToday,
  };
}
