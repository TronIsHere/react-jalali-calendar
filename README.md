# react-jalali-calendar

Persian (Jalali / Shamsi) calendar components and date utilities for React.  
Built on [jalaali-js](https://github.com/jalaali/jalaali-js) with no UI framework dependency.

[![npm](https://img.shields.io/npm/v/react-jalali-calendar)](https://www.npmjs.com/package/react-jalali-calendar)
[![license](https://img.shields.io/npm/l/react-jalali-calendar)](./LICENSE)

[فارسی](./README.fa.md)

---

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Components](#components)
  - [JalaliCalendar](#jalaicalendar)
  - [JalaliDatePicker](#jalalidatepicker)
- [Headless hook](#headless-hook)
- [Core utilities](#core-utilities)
- [Theming](#theming)
- [TypeScript types](#typescript-types)
- [Week convention](#week-convention)

---

## Installation

```bash
npm install react-jalali-calendar
# or
pnpm add react-jalali-calendar
# or
yarn add react-jalali-calendar
```

**Peer dependencies** (must already be in your project):

```bash
npm install react react-dom   # 18 or 19
```

---

## Quick start

```tsx
import { useState } from "react";
import { JalaliCalendar, JalaliDatePicker } from "react-jalali-calendar";
import "react-jalali-calendar/styles.css";

export function BookingForm() {
  const [date, setDate] = useState("");           // "YYYY-MM-DD" string
  const [selected, setSelected] = useState<Date | null>(null);

  return (
    <div>
      {/* Inline calendar */}
      <JalaliCalendar
        selectedDate={selected}
        onSelectDate={setSelected}
        latinDigits={false}
      />

      {/* Popup date picker */}
      <JalaliDatePicker value={date} onChange={setDate} />
    </div>
  );
}
```

> Import `styles.css` once in your app entry point (e.g. `main.tsx` or `layout.tsx`).

---

## Components

### JalaliCalendar

An inline month grid. The component manages its own navigation state internally; you only control which day is selected.

```tsx
import { JalaliCalendar } from "react-jalali-calendar";

<JalaliCalendar
  selectedDate={selected}
  onSelectDate={(date) => setSelected(date)}
/>
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedDate` | `Date \| null` | required | The currently selected date. Pass `null` for no selection. |
| `onSelectDate` | `(date: Date) => void` | required | Called with the `Date` object when the user clicks a day. |
| `isDateDisabled` | `(date: Date) => boolean` | — | Return `true` to make a day unclickable. |
| `latinDigits` | `boolean` | `false` | Show digits as `0-9` instead of `۰-۹`. |
| `initialMonth` | `{ jy: number; jm: number }` | current month | Jalali year/month shown on first render. |
| `prevMonthLabel` | `string` | `"ماه قبل"` | `aria-label` for the previous-month button. |
| `nextMonthLabel` | `string` | `"ماه بعد"` | `aria-label` for the next-month button. |
| `className` | `string` | — | Extra CSS class added to the root `<div>`. |

**Examples**

```tsx
// Disable all days in the past
<JalaliCalendar
  selectedDate={selected}
  onSelectDate={setSelected}
  isDateDisabled={(date) => date < new Date()}
/>

// Open on a specific month (Farvardin 1403)
<JalaliCalendar
  selectedDate={null}
  onSelectDate={setSelected}
  initialMonth={{ jy: 1403, jm: 1 }}
/>

// Latin digits + custom class
<JalaliCalendar
  selectedDate={selected}
  onSelectDate={setSelected}
  latinDigits
  className="my-calendar"
/>
```

---

### JalaliDatePicker

A button that opens a popover containing `JalaliCalendar`. Closes on outside click or Escape. The selected date is stored as a `"YYYY-MM-DD"` string (Gregorian local date key), which is easy to send to a server or store in a form.

```tsx
import { JalaliDatePicker } from "react-jalali-calendar";

const [date, setDate] = useState(""); // e.g. "2024-03-20"

<JalaliDatePicker value={date} onChange={setDate} />
```

**Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | A `YYYY-MM-DD` Gregorian date key, or `""` for no selection. |
| `onChange` | `(value: string) => void` | required | Called with the new `YYYY-MM-DD` string when a day is picked. |
| `placeholder` | `string` | `"انتخاب تاریخ"` | Text shown on the trigger button when no date is selected. |
| `latinDigits` | `boolean` | `false` | Display the selected date label with Latin digits. |
| `isDateDisabled` | `(date: Date) => boolean` | — | Passed through to the inner `JalaliCalendar`. |
| `className` | `string` | — | Extra class on the picker root element. |
| `calendarClassName` | `string` | — | Extra class on the inner `JalaliCalendar`. |

**Examples**

```tsx
// Disable weekends (Friday = index 5 in JS Date)
<JalaliDatePicker
  value={date}
  onChange={setDate}
  isDateDisabled={(d) => d.getDay() === 5}
  latinDigits
/>

// With a custom placeholder
<JalaliDatePicker
  value={date}
  onChange={setDate}
  placeholder="تاریخ تولد را انتخاب کنید"
/>
```

---

## Headless hook

Use `useJalaliCalendar` to build a completely custom calendar UI while letting the library handle month navigation and grid generation.

```tsx
import { useJalaliCalendar } from "react-jalali-calendar";
import { PERSIAN_MONTHS, PERSIAN_WEEKDAYS_SHORT, localDateKey } from "react-jalali-calendar/core";

function MyCalendar({ selectedDate, onSelectDate }) {
  const { jy, jm, grid, today, todayKey, prevMonth, nextMonth, goToMonth, goToToday } =
    useJalaliCalendar({ initialMonth: { jy: 1403, jm: 6 } });

  return (
    <div dir="rtl">
      <div>
        <button onClick={prevMonth}>قبل</button>
        <strong>{PERSIAN_MONTHS[jm - 1]} {jy}</strong>
        <button onClick={nextMonth}>بعد</button>
        <button onClick={goToToday}>امروز</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {PERSIAN_WEEKDAYS_SHORT.map((d) => (
          <span key={d}>{d}</span>
        ))}

        {grid.map((date, i) => {
          if (!date) return <span key={i} />;
          const key = localDateKey(date);
          return (
            <button
              key={key}
              onClick={() => onSelectDate(date)}
              style={{ fontWeight: key === todayKey ? "bold" : undefined }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**Return value**

| Property | Type | Description |
|----------|------|-------------|
| `jy` | `number` | Currently displayed Jalali year. |
| `jm` | `number` | Currently displayed Jalali month (1-12). |
| `grid` | `(Date \| null)[]` | Flat array of day cells. `null` entries are leading empty cells before the 1st of the month. |
| `today` | `JalaliDateParts` | Today's `{ jy, jm, jd }`. |
| `todayKey` | `string` | Today as `"YYYY-MM-DD"`, useful for highlighting. |
| `prevMonth` | `() => void` | Navigate one month back. |
| `nextMonth` | `() => void` | Navigate one month forward. |
| `goToMonth` | `(jy, jm) => void` | Jump to any Jalali year/month directly. |
| `goToToday` | `() => void` | Jump back to the current month. |

**Options**

```ts
useJalaliCalendar({
  initialMonth: { jy: 1403, jm: 1 }, // optional, defaults to current month
})
```

---

## Core utilities

Import pure date helpers from the `/core` sub-path. This entry point has **no React dependency** and can be used in Node.js, server components, or non-React projects.

```ts
import {
  toJalali,
  fromJalali,
  formatJalali,
  formatTime,
  getJalaliMonthGrid,
  getJalaliWeekDates,
  addJalaliMonths,
  monthDateRange,
  localDateKey,
  isoDateOnly,
  toLatinDigits,
  toPersianDigits,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  PERSIAN_WEEKDAYS_SHORT,
} from "react-jalali-calendar/core";
```

### Conversion

#### `toJalali(date: Date): JalaliDateParts`

Convert a `Date` object to Jalali parts.

```ts
toJalali(new Date("2024-03-20"));
// => { jy: 1403, jm: 1, jd: 1 }
```

#### `fromJalali(parts: JalaliDateParts): Date`

Convert Jalali `{ jy, jm, jd }` back to a Gregorian `Date`.

```ts
fromJalali({ jy: 1403, jm: 1, jd: 1 });
// => Date("2024-03-20")
```

### Formatting

#### `formatJalali(date, options?): string`

Human-readable Jalali date string.

```ts
formatJalali(new Date("2024-03-20"));
// => "۱ فروردین ۱۴۰۳"

formatJalali(new Date("2024-03-20"), { includeWeekday: true });
// => "چهارشنبه، ۱ فروردین ۱۴۰۳"

formatJalali(new Date("2024-03-20"), { latinDigits: true });
// => "1 فروردین 1403"
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeWeekday` | `boolean` | `false` | Prepend the Persian weekday name. |
| `latinDigits` | `boolean` | `false` | Use `0-9` instead of `۰-۹`. |

#### `formatTime(date: Date, latinDigits?: boolean): string`

Format hours and minutes as `HH:MM`.

```ts
formatTime(new Date(), true);   // "09:45"
formatTime(new Date(), false);  // "۰۹:۴۵"
```

#### `toPersianDigits(value: string): string`

Replace `0-9` with `۰-۹` anywhere in a string.

```ts
toPersianDigits("1403/01/01"); // "۱۴۰۳/۰۱/۰۱"
```

#### `toLatinDigits(value: string): string`

Replace `۰-۹` with `0-9` anywhere in a string.

```ts
toLatinDigits("۱۴۰۳"); // "1403"
```

### Date keys

#### `localDateKey(date: Date): string`

Returns a `"YYYY-MM-DD"` string using **local** time (no UTC shift). This is the format used by `JalaliDatePicker`.

```ts
localDateKey(new Date("2024-03-20")); // "2024-03-20"
```

#### `isoDateOnly(date: Date): string`

Returns a `"YYYY-MM-DD"` string using **UTC** (`date.toISOString().slice(0, 10)`).

### Grid helpers

#### `getJalaliMonthGrid(jy: number, jm: number): (Date | null)[]`

Returns a flat array of cells for a full month grid (Saturday-anchored). Leading cells before the 1st are `null`.

```ts
const cells = getJalaliMonthGrid(1403, 1);
// cells[0] might be null (padding), then Date objects for each day
```

#### `getJalaliWeekDates(jy: number, jm: number, jd: number): Date[]`

Returns the 7 `Date` objects for the Jalali week (Saturday to Friday) containing the given date.

```ts
getJalaliWeekDates(1403, 1, 10); // [Date(Sat), ..., Date(Fri)]
```

#### `addJalaliMonths(jy: number, jm: number, delta: number): JalaliDateParts`

Add or subtract months, handling year rollovers correctly.

```ts
addJalaliMonths(1403, 12, 1);  // => { jy: 1404, jm: 1, jd: 1 }
addJalaliMonths(1403, 1, -1);  // => { jy: 1402, jm: 12, jd: 1 }
```

#### `monthDateRange(jy: number, jm: number): { from: Date; to: Date }`

Returns the first and last `Date` of a Jalali month (last date is set to `23:59:59.999`). Useful for API range queries.

```ts
const { from, to } = monthDateRange(1403, 1);
// from: 2024-03-20 00:00:00
// to:   2024-04-19 23:59:59.999
```

### Constants

```ts
PERSIAN_MONTHS[0]         // "فروردین"  (index 0 = month 1)
PERSIAN_WEEKDAYS[0]       // "شنبه"     (index 0 = Saturday)
PERSIAN_WEEKDAYS_SHORT[0] // "ش"
```

---

## Theming

The components use CSS custom properties scoped under the `.rjc` and `.rjc-picker` class names. Override any variable to match your design system.

```css
/* globals.css or any stylesheet loaded after styles.css */
:root {
  --rjc-primary:     #7c3aed;
  --rjc-primary-fg:  #ffffff;
  --rjc-radius:      0.75rem;
  --rjc-font:        "Vazirmatn", sans-serif;
}
```

Or scope overrides to a specific instance:

```css
.booking-calendar {
  --rjc-primary: #0ea5e9;
  --rjc-cell-size: 2.5rem;
}
```

```tsx
<JalaliCalendar className="booking-calendar" ... />
```

**All available variables**

| Variable | Controls |
|----------|----------|
| `--rjc-bg` | Calendar background |
| `--rjc-fg` | Text color |
| `--rjc-muted` | Weekday header text |
| `--rjc-border` | Border color |
| `--rjc-primary` | Selected day background |
| `--rjc-primary-fg` | Selected day text |
| `--rjc-hover` | Day hover background |
| `--rjc-today-ring` | Ring color on today's cell |
| `--rjc-disabled` | Disabled day text color |
| `--rjc-radius` | Border radius of cells and container |
| `--rjc-cell-size` | Width/height of each day cell |
| `--rjc-cell-gap` | Gap between cells in the grid |
| `--rjc-font` | Font family |

---

## TypeScript types

All public types are exported from the main entry point:

```ts
import type {
  JalaliDateParts,
  JalaliCalendarProps,
  JalaliDatePickerProps,
  UseJalaliCalendarOptions,
} from "react-jalali-calendar";
```

#### `JalaliDateParts`

```ts
type JalaliDateParts = {
  jy: number; // Jalali year
  jm: number; // Jalali month (1-12)
  jd: number; // Jalali day (1-29/30/31)
};
```

---

## Week convention

This library treats **Saturday as day 0** and **Friday as day 6**, which matches the Iranian week. The `grid` returned by `getJalaliMonthGrid` and `useJalaliCalendar` is aligned to this convention -- the first column is always Saturday.

| Index | Day |
|-------|-----|
| 0 | شنبه (Saturday) |
| 1 | یکشنبه (Sunday) |
| 2 | دوشنبه (Monday) |
| 3 | سه‌شنبه (Tuesday) |
| 4 | چهارشنبه (Wednesday) |
| 5 | پنجشنبه (Thursday) |
| 6 | جمعه (Friday) |

---

## License

[MIT](./LICENSE) - [TronIsHere](https://github.com/TronIsHere)
