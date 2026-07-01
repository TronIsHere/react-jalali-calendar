<div dir="rtl">

# react-jalali-calendar

کامپوننت‌های تقویم جلالی (شمسی) و ابزارهای تاریخ برای React.  
ساخته‌شده بر پایه [jalaali-js](https://github.com/jalaali/jalaali-js) بدون هیچ وابستگی به فریم‌ورک UI.

[![npm](https://img.shields.io/npm/v/react-jalali-calendar)](https://www.npmjs.com/package/react-jalali-calendar)
[![license](https://img.shields.io/npm/l/react-jalali-calendar)](./LICENSE)

[English](./README.md)

---

## فهرست مطالب

- [نصب](#نصب)
- [شروع سریع](#شروع-سریع)
- [کامپوننت‌ها](#کامپوننت‌ها)
  - [JalaliCalendar](#jalaicalendar)
  - [JalaliDatePicker](#jalalidatepicker)
- [هوک بدون UI](#هوک-بدون-ui)
- [توابع پایه](#توابع-پایه)
- [تم‌بندی](#تم‌بندی)
- [تایپ‌های TypeScript](#تایپ‌های-typescript)
- [قرارداد هفته](#قرارداد-هفته)

---

## نصب

```bash
npm install react-jalali-calendar
# یا
pnpm add react-jalali-calendar
# یا
yarn add react-jalali-calendar
```

**وابستگی‌های همتا** (باید از قبل در پروژه وجود داشته باشند):

```bash
npm install react react-dom   # نسخه ۱۸ یا ۱۹
```

---

## شروع سریع

```tsx
import { useState } from "react";
import { JalaliCalendar, JalaliDatePicker } from "react-jalali-calendar";
import "react-jalali-calendar/styles.css";

export function BookingForm() {
  const [date, setDate] = useState("");           // رشته "YYYY-MM-DD"
  const [selected, setSelected] = useState<Date | null>(null);

  return (
    <div>
      {/* تقویم درون‌خطی */}
      <JalaliCalendar
        selectedDate={selected}
        onSelectDate={setSelected}
        latinDigits={false}
      />

      {/* انتخاب‌گر تاریخ با پاپ‌اور */}
      <JalaliDatePicker value={date} onChange={setDate} />
    </div>
  );
}
```

> فایل `styles.css` را فقط یک‌بار در نقطه ورودی اپلیکیشن ایمپورت کنید (مثلاً `main.tsx` یا `layout.tsx`).

---

## کامپوننت‌ها

### JalaliCalendar

یک گرید ماهانه درون‌خطی. کامپوننت وضعیت ناوبری را خودش مدیریت می‌کند؛ شما فقط کنترل می‌کنید کدام روز انتخاب شده است.

```tsx
import { JalaliCalendar } from "react-jalali-calendar";

<JalaliCalendar
  selectedDate={selected}
  onSelectDate={(date) => setSelected(date)}
/>
```

**پراپ‌ها**

| پراپ | نوع | پیش‌فرض | توضیح |
|------|------|---------|-------|
| `selectedDate` | `Date \| null` | اجباری | تاریخ انتخاب‌شده فعلی. برای بدون انتخاب، `null` بفرستید. |
| `onSelectDate` | `(date: Date) => void` | اجباری | هنگام کلیک روی یک روز با آبجکت `Date` صدا زده می‌شود. |
| `isDateDisabled` | `(date: Date) => boolean` | — | برای غیرفعال کردن یک روز `true` برگردانید. |
| `latinDigits` | `boolean` | `false` | نمایش اعداد به صورت `0-9` به جای `۰-۹`. |
| `initialMonth` | `{ jy: number; jm: number }` | ماه جاری | سال و ماه جلالی نمایش‌داده‌شده در اولین رندر. |
| `prevMonthLabel` | `string` | `"ماه قبل"` | `aria-label` دکمه ماه قبل. |
| `nextMonthLabel` | `string` | `"ماه بعد"` | `aria-label` دکمه ماه بعد. |
| `className` | `string` | — | کلاس CSS اضافی روی المان ریشه. |

**مثال‌ها**

```tsx
// غیرفعال کردن تمام روزهای گذشته
<JalaliCalendar
  selectedDate={selected}
  onSelectDate={setSelected}
  isDateDisabled={(date) => date < new Date()}
/>

// باز شدن در ماه خاص (فروردین ۱۴۰۳)
<JalaliCalendar
  selectedDate={null}
  onSelectDate={setSelected}
  initialMonth={{ jy: 1403, jm: 1 }}
/>

// اعداد لاتین + کلاس سفارشی
<JalaliCalendar
  selectedDate={selected}
  onSelectDate={setSelected}
  latinDigits
  className="my-calendar"
/>
```

---

### JalaliDatePicker

یک دکمه که با کلیک روی آن یک پاپ‌اور حاوی `JalaliCalendar` باز می‌شود. با کلیک بیرون از پاپ‌اور یا فشردن Escape بسته می‌شود. تاریخ انتخاب‌شده به صورت رشته `"YYYY-MM-DD"` (میلادی) ذخیره می‌شود که برای ارسال به سرور یا ذخیره در فرم مناسب است.

```tsx
import { JalaliDatePicker } from "react-jalali-calendar";

const [date, setDate] = useState(""); // مثلاً "2024-03-20"

<JalaliDatePicker value={date} onChange={setDate} />
```

**پراپ‌ها**

| پراپ | نوع | پیش‌فرض | توضیح |
|------|------|---------|-------|
| `value` | `string` | اجباری | کلید تاریخ میلادی به فرمت `YYYY-MM-DD`، یا `""` برای بدون انتخاب. |
| `onChange` | `(value: string) => void` | اجباری | هنگام انتخاب روز با رشته جدید `YYYY-MM-DD` صدا زده می‌شود. |
| `placeholder` | `string` | `"انتخاب تاریخ"` | متن نمایش‌داده‌شده روی دکمه هنگامی که تاریخی انتخاب نشده. |
| `latinDigits` | `boolean` | `false` | نمایش برچسب تاریخ با اعداد لاتین. |
| `isDateDisabled` | `(date: Date) => boolean` | — | به `JalaliCalendar` درونی پاس داده می‌شود. |
| `className` | `string` | — | کلاس اضافی روی المان ریشه پیکر. |
| `calendarClassName` | `string` | — | کلاس اضافی روی `JalaliCalendar` درونی. |

**مثال‌ها**

```tsx
// غیرفعال کردن روزهای جمعه (getDay() === 5)
<JalaliDatePicker
  value={date}
  onChange={setDate}
  isDateDisabled={(d) => d.getDay() === 5}
  latinDigits
/>

// با متن راهنمای سفارشی
<JalaliDatePicker
  value={date}
  onChange={setDate}
  placeholder="تاریخ تولد را انتخاب کنید"
/>
```

---

## هوک بدون UI

از `useJalaliCalendar` برای ساخت یک رابط کاربری کاملاً سفارشی استفاده کنید، در حالی که مدیریت ناوبری ماه و تولید گرید را به کتابخانه بسپارید.

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

**مقدار برگشتی**

| خاصیت | نوع | توضیح |
|-------|------|-------|
| `jy` | `number` | سال جلالی در حال نمایش. |
| `jm` | `number` | ماه جلالی در حال نمایش (۱ تا ۱۲). |
| `grid` | `(Date \| null)[]` | آرایه‌ای از سلول‌های روز. مقادیر `null` سلول‌های خالی ابتدای ماه هستند. |
| `today` | `JalaliDateParts` | امروز به صورت `{ jy, jm, jd }`. |
| `todayKey` | `string` | امروز به فرمت `"YYYY-MM-DD"`، مفید برای هایلایت کردن. |
| `prevMonth` | `() => void` | رفتن به ماه قبل. |
| `nextMonth` | `() => void` | رفتن به ماه بعد. |
| `goToMonth` | `(jy, jm) => void` | پریدن مستقیم به هر سال/ماه جلالی. |
| `goToToday` | `() => void` | بازگشت به ماه جاری. |

**تنظیمات**

```ts
useJalaliCalendar({
  initialMonth: { jy: 1403, jm: 1 }, // اختیاری، پیش‌فرض: ماه جاری
})
```

---

## توابع پایه

توابع خالص تاریخ را از مسیر فرعی `/core` ایمپورت کنید. این نقطه ورودی **هیچ وابستگی به React ندارد** و در Node.js، Server Components یا پروژه‌های غیر-React نیز قابل استفاده است.

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

### تبدیل تاریخ

#### `toJalali(date: Date): JalaliDateParts`

تبدیل آبجکت `Date` به اجزای جلالی.

```ts
toJalali(new Date("2024-03-20"));
// => { jy: 1403, jm: 1, jd: 1 }
```

#### `fromJalali(parts: JalaliDateParts): Date`

تبدیل `{ jy, jm, jd }` جلالی به `Date` میلادی.

```ts
fromJalali({ jy: 1403, jm: 1, jd: 1 });
// => Date("2024-03-20")
```

### قالب‌بندی

#### `formatJalali(date, options?): string`

رشته تاریخ جلالی برای نمایش به کاربر.

```ts
formatJalali(new Date("2024-03-20"));
// => "۱ فروردین ۱۴۰۳"

formatJalali(new Date("2024-03-20"), { includeWeekday: true });
// => "چهارشنبه، ۱ فروردین ۱۴۰۳"

formatJalali(new Date("2024-03-20"), { latinDigits: true });
// => "1 فروردین 1403"
```

| گزینه | نوع | پیش‌فرض | توضیح |
|-------|------|---------|-------|
| `includeWeekday` | `boolean` | `false` | اضافه کردن نام روز هفته به ابتدای رشته. |
| `latinDigits` | `boolean` | `false` | استفاده از `0-9` به جای `۰-۹`. |

#### `formatTime(date: Date, latinDigits?: boolean): string`

قالب‌بندی ساعت و دقیقه به صورت `HH:MM`.

```ts
formatTime(new Date(), true);   // "09:45"
formatTime(new Date(), false);  // "۰۹:۴۵"
```

#### `toPersianDigits(value: string): string`

جایگزین کردن `0-9` با `۰-۹` در هر جایی از رشته.

```ts
toPersianDigits("1403/01/01"); // "۱۴۰۳/۰۱/۰۱"
```

#### `toLatinDigits(value: string): string`

جایگزین کردن `۰-۹` با `0-9` در هر جایی از رشته.

```ts
toLatinDigits("۱۴۰۳"); // "1403"
```

### کلیدهای تاریخ

#### `localDateKey(date: Date): string`

رشته `"YYYY-MM-DD"` بر اساس **زمان محلی** (بدون تغییر UTC). این همان فرمتی است که `JalaliDatePicker` استفاده می‌کند.

```ts
localDateKey(new Date("2024-03-20")); // "2024-03-20"
```

#### `isoDateOnly(date: Date): string`

رشته `"YYYY-MM-DD"` بر اساس **UTC** (معادل `date.toISOString().slice(0, 10)`).

### توابع کمکی گرید

#### `getJalaliMonthGrid(jy: number, jm: number): (Date | null)[]`

آرایه‌ای مسطح از سلول‌های گرید ماهانه (شروع از شنبه) برمی‌گرداند. سلول‌های خالی قبل از روز اول، `null` هستند.

```ts
const cells = getJalaliMonthGrid(1403, 1);
// cells[0] ممکن است null باشد (فاصله)، سپس آبجکت‌های Date برای هر روز
```

#### `getJalaliWeekDates(jy: number, jm: number, jd: number): Date[]`

۷ آبجکت `Date` برای هفته جلالی (شنبه تا جمعه) حاوی تاریخ مشخص‌شده را برمی‌گرداند.

```ts
getJalaliWeekDates(1403, 1, 10); // [Date(شنبه), ..., Date(جمعه)]
```

#### `addJalaliMonths(jy: number, jm: number, delta: number): JalaliDateParts`

جمع یا تفریق ماه، با مدیریت صحیح تغییر سال.

```ts
addJalaliMonths(1403, 12, 1);  // => { jy: 1404, jm: 1, jd: 1 }
addJalaliMonths(1403, 1, -1);  // => { jy: 1402, jm: 12, jd: 1 }
```

#### `monthDateRange(jy: number, jm: number): { from: Date; to: Date }`

اولین و آخرین `Date` یک ماه جلالی را برمی‌گرداند (آخرین روز با `23:59:59.999` تنظیم می‌شود). مناسب برای کوئری‌های بازه‌ای API.

```ts
const { from, to } = monthDateRange(1403, 1);
// from: 2024-03-20 00:00:00
// to:   2024-04-19 23:59:59.999
```

### ثابت‌ها

```ts
PERSIAN_MONTHS[0]         // "فروردین"  (ایندکس 0 = ماه 1)
PERSIAN_WEEKDAYS[0]       // "شنبه"     (ایندکس 0 = شنبه)
PERSIAN_WEEKDAYS_SHORT[0] // "ش"
```

---

## تم‌بندی

کامپوننت‌ها از متغیرهای CSS تحت کلاس‌های `.rjc` و `.rjc-picker` استفاده می‌کنند. هر متغیر را می‌توانید برای تطابق با سیستم طراحی خود بازنویسی کنید.

```css
/* globals.css یا هر استایل‌شیتی که بعد از styles.css بارگذاری می‌شود */
:root {
  --rjc-primary:     #7c3aed;
  --rjc-primary-fg:  #ffffff;
  --rjc-radius:      0.75rem;
  --rjc-font:        "Vazirmatn", sans-serif;
}
```

یا فقط برای یک نمونه خاص:

```css
.booking-calendar {
  --rjc-primary: #0ea5e9;
  --rjc-cell-size: 2.5rem;
}
```

```tsx
<JalaliCalendar className="booking-calendar" ... />
```

**تمام متغیرهای موجود**

| متغیر | کنترل می‌کند |
|-------|-------------|
| `--rjc-bg` | پس‌زمینه تقویم |
| `--rjc-fg` | رنگ متن |
| `--rjc-muted` | متن سرتیتر روزهای هفته |
| `--rjc-border` | رنگ حاشیه |
| `--rjc-primary` | پس‌زمینه روز انتخاب‌شده |
| `--rjc-primary-fg` | متن روز انتخاب‌شده |
| `--rjc-hover` | پس‌زمینه روز هنگام هاور |
| `--rjc-today-ring` | رنگ حلقه دور روز امروز |
| `--rjc-disabled` | رنگ متن روز غیرفعال |
| `--rjc-radius` | شعاع گوشه سلول‌ها و ظرف |
| `--rjc-cell-size` | عرض/ارتفاع هر سلول روز |
| `--rjc-cell-gap` | فاصله بین سلول‌ها در گرید |
| `--rjc-font` | فونت |

---

## تایپ‌های TypeScript

تمام تایپ‌های عمومی از نقطه ورودی اصلی اکسپورت می‌شوند:

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
  jy: number; // سال جلالی
  jm: number; // ماه جلالی (۱ تا ۱۲)
  jd: number; // روز جلالی (۱ تا ۲۹/۳۰/۳۱)
};
```

---

## قرارداد هفته

این کتابخانه **شنبه را روز ۰** و **جمعه را روز ۶** در نظر می‌گیرد که با تقویم ایرانی مطابقت دارد. گرید برگشتی از `getJalaliMonthGrid` و `useJalaliCalendar` بر این اساس تنظیم شده است -- ستون اول همیشه شنبه است.

| ایندکس | روز |
|--------|-----|
| 0 | شنبه |
| 1 | یکشنبه |
| 2 | دوشنبه |
| 3 | سه‌شنبه |
| 4 | چهارشنبه |
| 5 | پنجشنبه |
| 6 | جمعه |

---

## مجوز

[MIT](./LICENSE) - [TronIsHere](https://github.com/TronIsHere)

</div>
