import { describe, expect, it } from "vitest";
import {
  addJalaliMonths,
  formatJalali,
  formatTime,
  fromJalali,
  getJalaliMonthGrid,
  getJalaliWeekDates,
  gregorianToWeekday,
  localDateKey,
  monthDateRange,
  toJalali,
  toLatinDigits,
  toPersianDigits,
} from "./core";

describe("toJalali / fromJalali", () => {
  it("round-trips a Gregorian date", () => {
    const date = new Date(2026, 2, 20);
    const jalali = toJalali(date);
    expect(jalali).toEqual({ jy: 1404, jm: 12, jd: 29 });
    expect(localDateKey(fromJalali(jalali))).toBe(localDateKey(date));
  });
});

describe("gregorianToWeekday", () => {
  it("maps Saturday to 0", () => {
    const saturday = new Date(2026, 2, 21);
    expect(saturday.getDay()).toBe(6);
    expect(gregorianToWeekday(saturday)).toBe(0);
  });
});

describe("formatJalali", () => {
  const date = new Date(2026, 2, 20);

  it("uses Persian digits by default", () => {
    expect(formatJalali(date)).toBe("۲۹ اسفند ۱۴۰۴");
  });

  it("uses Persian digits when latinDigits is false", () => {
    expect(formatJalali(date, { latinDigits: false })).toBe("۲۹ اسفند ۱۴۰۴");
  });

  it("uses Latin digits when latinDigits is true", () => {
    expect(formatJalali(date, { latinDigits: true })).toBe("29 اسفند 1404");
  });

  it("includes weekday when requested", () => {
    expect(formatJalali(date, { includeWeekday: true, latinDigits: true })).toBe(
      "جمعه، 29 اسفند 1404",
    );
  });
});

describe("digit helpers", () => {
  it("converts between Latin and Persian digits", () => {
    expect(toPersianDigits("1404")).toBe("۱۴۰۴");
    expect(toLatinDigits("۱۴۰۴")).toBe("1404");
  });
});

describe("formatTime", () => {
  it("formats hours and minutes", () => {
    const date = new Date(2026, 2, 20, 9, 5);
    expect(formatTime(date)).toBe("09:05");
    expect(formatTime(date, false)).toBe("۰۹:۰۵");
  });
});

describe("getJalaliMonthGrid", () => {
  it("returns the correct number of days for Esfand 1404", () => {
    const grid = getJalaliMonthGrid(1404, 12);
    expect(grid.filter(Boolean)).toHaveLength(29);
  });

  it("pads leading cells to align the first day", () => {
    const grid = getJalaliMonthGrid(1404, 12);
    const firstDayIndex = grid.findIndex(Boolean);
    expect(firstDayIndex).toBeGreaterThanOrEqual(0);
    expect(grid.slice(0, firstDayIndex).every((cell) => cell === null)).toBe(true);
  });
});

describe("getJalaliWeekDates", () => {
  it("returns seven consecutive dates starting on Saturday", () => {
    const week = getJalaliWeekDates(1404, 12, 29);
    expect(week).toHaveLength(7);
    expect(gregorianToWeekday(week[0]!)).toBe(0);
    expect(localDateKey(week[6]!)).toBe(
      localDateKey(new Date(week[0]!.getTime() + 6 * 24 * 60 * 60 * 1000)),
    );
  });
});

describe("addJalaliMonths", () => {
  it("moves to the previous month across year boundaries", () => {
    expect(addJalaliMonths(1400, 1, -1)).toEqual({ jy: 1399, jm: 12, jd: 1 });
  });

  it("moves to the next month", () => {
    expect(addJalaliMonths(1400, 12, 1)).toEqual({ jy: 1401, jm: 1, jd: 1 });
  });
});

describe("monthDateRange", () => {
  it("spans the full Jalali month in local time", () => {
    const { from, to } = monthDateRange(1404, 12);
    expect(toJalali(from)).toMatchObject({ jy: 1404, jm: 12, jd: 1 });
    expect(toJalali(to)).toMatchObject({ jy: 1404, jm: 12, jd: 29 });
    expect(to.getHours()).toBe(23);
  });
});

describe("localDateKey", () => {
  it("formats YYYY-MM-DD in local time", () => {
    expect(localDateKey(new Date(2026, 2, 20))).toBe("2026-03-20");
  });
});
