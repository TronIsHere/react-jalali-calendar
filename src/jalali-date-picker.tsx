"use client";

import { useEffect, useId, useRef, useState } from "react";
import { formatJalali, localDateKey, toJalali } from "./core";
import { CalendarIcon } from "./icons";
import { JalaliCalendar } from "./jalali-calendar";

export type JalaliDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  latinDigits?: boolean;
  isDateDisabled?: (date: Date) => boolean;
  calendarClassName?: string;
};

function joinClassNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function JalaliDatePicker({
  value,
  onChange,
  className,
  placeholder = "انتخاب تاریخ",
  latinDigits = false,
  isDateDisabled,
  calendarClassName,
}: JalaliDatePickerProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedDate = value ? new Date(`${value}T12:00:00`) : null;
  const initialMonth = selectedDate ? toJalali(selectedDate) : undefined;

  function handleSelect(date: Date) {
    onChange(localDateKey(date));
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className={joinClassNames("rjc-picker", className)} ref={rootRef}>
      <button
        type="button"
        className={joinClassNames(
          "rjc-picker__trigger",
          !value && "rjc-picker__trigger--placeholder",
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
      >
        <CalendarIcon />
        {value
          ? formatJalali(new Date(`${value}T12:00:00`), {
              includeWeekday: true,
              latinDigits,
            })
          : placeholder}
      </button>

      {open ? (
        <div className="rjc-picker__popover" id={listboxId} role="dialog">
          <JalaliCalendar
            selectedDate={selectedDate}
            onSelectDate={handleSelect}
            isDateDisabled={isDateDisabled}
            latinDigits={latinDigits}
            initialMonth={initialMonth}
            className={calendarClassName}
          />
        </div>
      ) : null}
    </div>
  );
}
