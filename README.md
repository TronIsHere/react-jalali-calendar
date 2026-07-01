# react-jalali-calendar

Persian (Jalali / Shamsi) calendar utilities and React components. Built on [jalaali-js](https://github.com/jalaali/jalaali-js) with zero UI framework dependencies.

## Install

```bash
npm install react-jalali-calendar
```

Peer dependencies: `react` and `react-dom` (18+).

## Quick start

```tsx
import { useState } from "react";
import { JalaliCalendar, JalaliDatePicker } from "react-jalali-calendar";
import "react-jalali-calendar/styles.css";

export function BookingDate() {
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<Date | null>(null);

  return (
    <div>
      <JalaliDatePicker value={date} onChange={setDate} />

      <JalaliCalendar
        selectedDate={selected}
        onSelectDate={setSelected}
        latinDigits={false}
      />
    </div>
  );
}
```

## Core utilities (no React)

Import only the date helpers when you do not need components:

```ts
import {
  toJalali,
  fromJalali,
  formatJalali,
  formatTime,
  getJalaliMonthGrid,
  localDateKey,
} from "react-jalali-calendar/core";

const jalali = toJalali(new Date());
console.log(formatJalali(new Date(), { includeWeekday: true }));
```

## Headless hook

Build your own UI with `useJalaliCalendar`:

```tsx
import { useJalaliCalendar } from "react-jalali-calendar";

function CustomCalendar() {
  const { jy, jm, grid, prevMonth, nextMonth } = useJalaliCalendar();
  // render your own month grid
}
```

## Theming

Components use CSS variables you can override:

```css
.my-calendar {
  --rjc-primary: #7c3aed;
  --rjc-primary-fg: #ffffff;
  --rjc-radius: 0.75rem;
}
```

```tsx
<JalaliCalendar className="my-calendar" ... />
```

Available variables: `--rjc-bg`, `--rjc-fg`, `--rjc-muted`, `--rjc-border`, `--rjc-primary`, `--rjc-primary-fg`, `--rjc-hover`, `--rjc-today-ring`, `--rjc-disabled`, `--rjc-radius`, `--rjc-cell-size`, `--rjc-cell-gap`, `--rjc-font`.

## API

### `JalaliCalendar`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectedDate` | `Date \| null` | required | Currently selected day |
| `onSelectDate` | `(date: Date) => void` | required | Called when a day is picked |
| `isDateDisabled` | `(date: Date) => boolean` | — | Disable specific days |
| `latinDigits` | `boolean` | `false` | Use 0-9 instead of ۰-۹ |
| `initialMonth` | `{ jy, jm }` | today | Month shown on first render |
| `className` | `string` | — | Extra class on root element |

### `JalaliDatePicker`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | required | `YYYY-MM-DD` local date key |
| `onChange` | `(value: string) => void` | required | Called with new date key |
| `placeholder` | `string` | `انتخاب تاریخ` | Empty state label |
| `latinDigits` | `boolean` | `false` | Format label with Latin digits |
| `isDateDisabled` | `(date: Date) => boolean` | — | Passed to inner calendar |

Week convention: **Saturday = 0** through **Friday = 6**.

## Publish

From the package directory:

```bash
cd packages/react-jalali-calendar
npm run build
npm publish --access public
```

## License

MIT
