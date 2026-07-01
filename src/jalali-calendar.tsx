"use client";

import {
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS_SHORT,
  localDateKey,
  toJalali,
  toPersianDigits,
  type JalaliDateParts,
} from "./core";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { useJalaliCalendar } from "./use-jalali-calendar";

export type JalaliCalendarProps = {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  isDateDisabled?: (date: Date) => boolean;
  latinDigits?: boolean;
  className?: string;
  initialMonth?: Pick<JalaliDateParts, "jy" | "jm">;
  prevMonthLabel?: string;
  nextMonthLabel?: string;
};

function formatDayNumber(date: Date, latinDigits: boolean) {
  const { jd } = toJalali(date);
  const text = String(jd);
  return latinDigits ? text : toPersianDigits(text);
}

function formatYear(jy: number, latinDigits: boolean) {
  const text = String(jy);
  return latinDigits ? text : toPersianDigits(text);
}

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function JalaliCalendar({
  selectedDate,
  onSelectDate,
  isDateDisabled,
  latinDigits = false,
  className,
  initialMonth,
  prevMonthLabel = "ماه قبل",
  nextMonthLabel = "ماه بعد",
}: JalaliCalendarProps) {
  const { jy, jm, grid, todayKey, prevMonth, nextMonth } = useJalaliCalendar({
    initialMonth,
  });

  return (
    <div className={joinClassNames("rjc", className)}>
      <div className="rjc__header">
        <button
          type="button"
          className="rjc__nav"
          onClick={prevMonth}
          aria-label={prevMonthLabel}
        >
          <ChevronRightIcon />
        </button>
        <span className="rjc__title">
          {PERSIAN_MONTHS[jm - 1]} {formatYear(jy, latinDigits)}
        </span>
        <button
          type="button"
          className="rjc__nav"
          onClick={nextMonth}
          aria-label={nextMonthLabel}
        >
          <ChevronLeftIcon />
        </button>
      </div>

      <div className="rjc__weekdays">
        {PERSIAN_WEEKDAYS_SHORT.map((day) => (
          <span key={day} className="rjc__weekday">
            {day}
          </span>
        ))}
      </div>

      <div className="rjc__grid">
        {grid.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} className="rjc__empty" aria-hidden />;
          }

          const key = localDateKey(date);
          const disabled = isDateDisabled?.(date) ?? false;
          const isSelected = Boolean(selectedDate && localDateKey(selectedDate) === key);
          const isToday = key === todayKey;

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(date)}
              className={joinClassNames(
                "rjc__day",
                isSelected && "rjc__day--selected",
                isToday && "rjc__day--today",
              )}
            >
              {formatDayNumber(date, latinDigits)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
