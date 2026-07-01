<div dir="rtl">

# react-jalali-calendar

یه کتابخانه ساده و سبک برای نمایش تقویم شمسی در React.  
زیرش از [jalaali-js](https://github.com/jalaali/jalaali-js) استفاده می‌کنه و هیچ وابستگی به فریم‌ورک UI خاصی نداره.

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
- [هوک Headless](#هوک-headless)
- [توابع پایه](#توابع-پایه)
- [تم‌بندی](#تم‌بندی)
- [تایپ‌های TypeScript](#تایپ‌های-typescript)
- [ترتیب روزهای هفته](#ترتیب-روزهای-هفته)

---

## نصب

با هر پکیج منیجری که دوست داری:

```bash
npm install react-jalali-calendar
# یا
pnpm add react-jalali-calendar
# یا
yarn add react-jalali-calendar
```

فقط مطمئن شو که `react` و `react-dom` نسخه ۱۸ یا ۱۹ توی پروژه‌ات نصبه:

```bash
npm install react react-dom
```

---

## شروع سریع

سریع‌ترین راه اینه که `styles.css` رو یه بار توی entry point اپت ایمپورت کنی (مثلاً `main.tsx` یا `layout.tsx`) و بعد کامپوننت‌ها رو هر جا که خواستی بذاری:

```tsx
import { useState } from "react";
import { JalaliCalendar, JalaliDatePicker } from "react-jalali-calendar";
import "react-jalali-calendar/styles.css";

export function BookingForm() {
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<Date | null>(null);

  return (
    <div>
      {/* تقویم معمولی درون‌خطی */}
      <JalaliCalendar
        selectedDate={selected}
        onSelectDate={setSelected}
      />

      {/* دکمه‌ای که با کلیک تقویم رو باز می‌کنه */}
      <JalaliDatePicker value={date} onChange={setDate} />
    </div>
  );
}
```

همین! بقیه چیزا اختیاریه و اگه خواستی سفارشی‌سازی کنی ادامه رو بخون.

---

## کامپوننت‌ها

### JalaliCalendar

یه تقویم ماهانه که مستقیم توی صفحه نشون داده می‌شه. ناوبری بین ماه‌ها رو خودش مدیریت می‌کنه، تو فقط بهش می‌گی کدام روز انتخابه.

```tsx
import { JalaliCalendar } from "react-jalali-calendar";

<JalaliCalendar
  selectedDate={selected}
  onSelectDate={(date) => setSelected(date)}
/>
```

**پراپ‌ها**

| پراپ | نوع | پیش‌فرض | توضیح |
|------|-----|---------|-------|
| `selectedDate` | `Date \| null` | اجباری | روز انتخاب‌شده. اگه چیزی انتخاب نشده `null` بده. |
| `onSelectDate` | `(date: Date) => void` | اجباری | وقتی کاربر روی یه روز کلیک کنه صدا زده می‌شه. |
| `isDateDisabled` | `(date: Date) => boolean` | — | برای غیرفعال کردن روزهای خاص `true` برگردون. |
| `latinDigits` | `boolean` | `false` | اعداد رو به جای `۱۴۰۳` به شکل `1403` نشون بده. |
| `initialMonth` | `{ jy: number; jm: number }` | ماه جاری | تقویم اول بار کدام ماه رو نشون بده. |
| `prevMonthLabel` | `string` | `"ماه قبل"` | متن aria-label دکمه ماه قبل (برای accessibility). |
| `nextMonthLabel` | `string` | `"ماه بعد"` | متن aria-label دکمه ماه بعد (برای accessibility). |
| `className` | `string` | — | اگه می‌خوای کلاس CSS اضافه کنی. |

**چند مثال کاربردی**

```tsx
// روزهای گذشته رو غیرفعال کن (مثلاً برای رزرو)
<JalaliCalendar
  selectedDate={selected}
  onSelectDate={setSelected}
  isDateDisabled={(date) => date < new Date()}
/>

// تقویم از یه ماه خاص شروع بشه
<JalaliCalendar
  selectedDate={null}
  onSelectDate={setSelected}
  initialMonth={{ jy: 1403, jm: 1 }}
/>

// اعداد لاتین + یه کلاس برای استایل دادن
<JalaliCalendar
  selectedDate={selected}
  onSelectDate={setSelected}
  latinDigits
  className="my-calendar"
/>
```

---

### JalaliDatePicker

یه دکمه که با کلیک یه پاپ‌اور با تقویم باز می‌کنه. بعد از انتخاب تاریخ، پاپ‌اور بسته می‌شه. با کلیک بیرون یا زدن Escape هم بسته می‌شه.

تاریخ انتخاب‌شده به شکل رشته `"YYYY-MM-DD"` میلادی برمی‌گرده که می‌تونی مستقیم به سرور بفرستیش یا توی فرم ذخیره کنی.

```tsx
import { JalaliDatePicker } from "react-jalali-calendar";

const [date, setDate] = useState(""); // مثلاً "2024-03-20"

<JalaliDatePicker value={date} onChange={setDate} />
```

**پراپ‌ها**

| پراپ | نوع | پیش‌فرض | توضیح |
|------|-----|---------|-------|
| `value` | `string` | اجباری | تاریخ به فرمت `YYYY-MM-DD` میلادی. برای بدون انتخاب `""` بده. |
| `onChange` | `(value: string) => void` | اجباری | با رشته `YYYY-MM-DD` جدید صدا زده می‌شه. |
| `placeholder` | `string` | `"انتخاب تاریخ"` | متن دکمه وقتی تاریخی انتخاب نشده. |
| `latinDigits` | `boolean` | `false` | تاریخ نمایشی رو با اعداد لاتین نشون بده. |
| `isDateDisabled` | `(date: Date) => boolean` | — | به تقویم داخلی پاس داده می‌شه. |
| `className` | `string` | — | کلاس اضافی روی wrapper اصلی. |
| `calendarClassName` | `string` | — | کلاس اضافی روی تقویم داخل پاپ‌اور. |

**چند مثال کاربردی**

```tsx
// جمعه‌ها رو غیرفعال کن
<JalaliDatePicker
  value={date}
  onChange={setDate}
  isDateDisabled={(d) => d.getDay() === 5}
/>

// متن placeholder سفارشی
<JalaliDatePicker
  value={date}
  onChange={setDate}
  placeholder="تاریخ تولد را انتخاب کنید"
/>

// اعداد لاتین
<JalaliDatePicker
  value={date}
  onChange={setDate}
  latinDigits
/>
```

---

## هوک Headless

اگه طراحی پیش‌فرض کتابخانه بهت نمی‌خوره و می‌خوای تقویم کاملاً سفارشی بسازی، از `useJalaliCalendar` استفاده کن. منطق ناوبری و تولید گرید رو بهش بسپار، UI رو خودت بساز.

```tsx
import { useJalaliCalendar } from "react-jalali-calendar";
import {
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS_SHORT,
  localDateKey,
} from "react-jalali-calendar/core";

function MyCalendar({ selectedDate, onSelectDate }) {
  const {
    jy, jm,
    grid,
    todayKey,
    prevMonth,
    nextMonth,
    goToToday,
  } = useJalaliCalendar();

  return (
    <div dir="rtl">
      {/* هدر ماه */}
      <div>
        <button onClick={prevMonth}>قبل</button>
        <strong>{PERSIAN_MONTHS[jm - 1]} {jy}</strong>
        <button onClick={nextMonth}>بعد</button>
        <button onClick={goToToday}>امروز</button>
      </div>

      {/* گرید روزها */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {/* سرتیتر روزهای هفته */}
        {PERSIAN_WEEKDAYS_SHORT.map((d) => (
          <span key={d}>{d}</span>
        ))}

        {/* سلول‌های روزها */}
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

**چیزایی که هوک برمی‌گردونه**

| مقدار | نوع | توضیح |
|-------|-----|-------|
| `jy` | `number` | سال جلالی که الان نشون داده می‌شه. |
| `jm` | `number` | ماه جلالی که الان نشون داده می‌شه (۱ تا ۱۲). |
| `grid` | `(Date \| null)[]` | آرایه سلول‌های ماه. مقادیر `null` فضاهای خالی اول ماه‌ان. |
| `today` | `JalaliDateParts` | امروز به شکل `{ jy, jm, jd }`. |
| `todayKey` | `string` | امروز به فرمت `"YYYY-MM-DD"`، برای هایلایت کردن مفیده. |
| `prevMonth` | `() => void` | بره ماه قبل. |
| `nextMonth` | `() => void` | بره ماه بعد. |
| `goToMonth` | `(jy, jm) => void` | مستقیم به هر ماهی بره. |
| `goToToday` | `() => void` | برگرده به ماه امروز. |

**تنظیمات**

```ts
// اگه می‌خوای تقویم از یه ماه خاص شروع بشه:
useJalaliCalendar({
  initialMonth: { jy: 1403, jm: 1 },
})
```

---

## توابع پایه

همه توابع خالص تبدیل و فرمت‌بندی تاریخ از مسیر `/core` در دسترسه. این مسیر **هیچ وابستگی به React نداره** و می‌تونی توی Node.js، Server Components یا هر جای دیگه‌ای هم ازش استفاده کنی.

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

یه `Date` میلادی می‌گیره و اجزای شمسیش رو برمی‌گردونه.

```ts
toJalali(new Date("2024-03-20"));
// => { jy: 1403, jm: 1, jd: 1 }
```

#### `fromJalali(parts: JalaliDateParts): Date`

برعکسش — اجزای شمسی رو می‌گیره و یه `Date` میلادی می‌ده.

```ts
fromJalali({ jy: 1403, jm: 1, jd: 1 });
// => Date("2024-03-20")
```

### فرمت‌بندی

#### `formatJalali(date, options?): string`

تاریخ رو به یه رشته خوانا تبدیل می‌کنه.

```ts
formatJalali(new Date("2024-03-20"));
// => "۱ فروردین ۱۴۰۳"

formatJalali(new Date("2024-03-20"), { includeWeekday: true });
// => "چهارشنبه، ۱ فروردین ۱۴۰۳"

formatJalali(new Date("2024-03-20"), { latinDigits: true });
// => "1 فروردین 1403"
```

| گزینه | نوع | پیش‌فرض | توضیح |
|-------|-----|---------|-------|
| `includeWeekday` | `boolean` | `false` | اسم روز هفته رو اول اضافه کن. |
| `latinDigits` | `boolean` | `false` | اعداد فارسی رو با لاتین جایگزین کن. |

#### `formatTime(date: Date, latinDigits?: boolean): string`

ساعت و دقیقه رو به شکل `HH:MM` برمی‌گردونه.

```ts
formatTime(new Date(), true);   // "09:45"
formatTime(new Date(), false);  // "۰۹:۴۵"
```

#### `toPersianDigits(value: string): string`

اعداد لاتین یه رشته رو فارسی می‌کنه.

```ts
toPersianDigits("1403/01/01"); // "۱۴۰۳/۰۱/۰۱"
```

#### `toLatinDigits(value: string): string`

برعکسش — اعداد فارسی رو لاتین می‌کنه.

```ts
toLatinDigits("۱۴۰۳"); // "1403"
```

### کلیدهای تاریخ

#### `localDateKey(date: Date): string`

یه رشته `"YYYY-MM-DD"` بر اساس زمان محلی (نه UTC) برمی‌گردونه. همین فرمتیه که `JalaliDatePicker` ازش استفاده می‌کنه.

```ts
localDateKey(new Date("2024-03-20")); // "2024-03-20"
```

#### `isoDateOnly(date: Date): string`

مثل بالا ولی بر اساس UTC. معادل `date.toISOString().slice(0, 10)`.

### توابع کمکی گرید

#### `getJalaliMonthGrid(jy: number, jm: number): (Date | null)[]`

یه آرایه مسطح از سلول‌های گرید ماهانه برمی‌گردونه (از شنبه شروع می‌شه). سلول‌های `null` فضای خالی قبل از روز اول ماه‌ان.

```ts
const cells = getJalaliMonthGrid(1403, 1);
// اول چند تا null، بعدش Date برای هر روز
```

#### `getJalaliWeekDates(jy: number, jm: number, jd: number): Date[]`

هفت تا `Date` برای هفته‌ای که اون تاریخ توشه برمی‌گردونه (شنبه تا جمعه).

```ts
getJalaliWeekDates(1403, 1, 10); // [Date(شنبه), ..., Date(جمعه)]
```

#### `addJalaliMonths(jy: number, jm: number, delta: number): JalaliDateParts`

به ماه اضافه یا کم می‌کنه. تغییر سال رو هم خودش درست مدیریت می‌کنه.

```ts
addJalaliMonths(1403, 12, 1);  // => { jy: 1404, jm: 1, jd: 1 }
addJalaliMonths(1403, 1, -1);  // => { jy: 1402, jm: 12, jd: 1 }
```

#### `monthDateRange(jy: number, jm: number): { from: Date; to: Date }`

اول و آخر یه ماه شمسی رو به صورت `Date` میلادی برمی‌گردونه. برای فیلتر کردن داده‌ها توی API خیلی به کارت میاد.

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

کامپوننت‌ها از CSS variable استفاده می‌کنن. هر کدوم رو که خواستی بازنویسی کن تا با طراحی پروژه‌ات بخونه.

برای تغییر کلی توی کل اپ:

```css
/* globals.css */
:root {
  --rjc-primary:    #7c3aed;
  --rjc-primary-fg: #ffffff;
  --rjc-radius:     0.75rem;
  --rjc-font:       "Vazirmatn", sans-serif;
}
```

یا فقط برای یه جای خاص:

```css
.booking-calendar {
  --rjc-primary: #0ea5e9;
  --rjc-cell-size: 2.5rem;
}
```

```tsx
<JalaliCalendar className="booking-calendar" ... />
```

**همه متغیرها**

| متغیر | چی رو کنترل می‌کنه |
|-------|-------------------|
| `--rjc-bg` | پس‌زمینه تقویم |
| `--rjc-fg` | رنگ متن |
| `--rjc-muted` | رنگ سرتیتر روزهای هفته |
| `--rjc-border` | رنگ حاشیه‌ها |
| `--rjc-primary` | پس‌زمینه روز انتخاب‌شده |
| `--rjc-primary-fg` | رنگ متن روز انتخاب‌شده |
| `--rjc-hover` | پس‌زمینه روز هنگام هاور |
| `--rjc-today-ring` | رنگ حلقه دور روز امروز |
| `--rjc-disabled` | رنگ متن روزهای غیرفعال |
| `--rjc-radius` | گردی گوشه‌های سلول‌ها |
| `--rjc-cell-size` | اندازه هر سلول روز |
| `--rjc-cell-gap` | فاصله بین سلول‌ها |
| `--rjc-font` | فونت |

---

## تایپ‌های TypeScript

همه تایپ‌های عمومی از entry point اصلی اکسپورت می‌شن:

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
  jy: number; // سال شمسی
  jm: number; // ماه شمسی (۱ تا ۱۲)
  jd: number; // روز شمسی (۱ تا ۲۹/۳۰/۳۱)
};
```

---

## ترتیب روزهای هفته

این کتابخانه هفته رو از **شنبه** شروع می‌کنه که با تقویم ایرانی مطابقه. ستون اول گرید همیشه شنبه‌ست.

| ایندکس | روز |
|--------|-----|
| ۰ | شنبه |
| ۱ | یکشنبه |
| ۲ | دوشنبه |
| ۳ | سه‌شنبه |
| ۴ | چهارشنبه |
| ۵ | پنجشنبه |
| ۶ | جمعه |

---

## مجوز

[MIT](./LICENSE) - [TronIsHere](https://github.com/TronIsHere)

</div>
