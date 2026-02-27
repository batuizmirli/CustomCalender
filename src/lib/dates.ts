/**
 * Pure utility functions for date logic.
 * Handles leap years and week calculations.
 */

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

export const getDaysInYear = (year: number): number => {
  return isLeapYear(year) ? 366 : 365;
};

export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const getWeeksBetween = (start: Date, end: Date): number => {
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  // Ensure we compare timestamps correctly
  const diff = end.getTime() - start.getTime();
  return Math.floor(diff / oneWeek);
};

export const isValidDate = (d: any): boolean => {
  return d instanceof Date && !isNaN(d.getTime());
};
