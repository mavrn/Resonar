import { test, expect } from 'vitest';
import { formatDate } from '../utils/formatDate';

test('formatDate returns empty string when date is not provided', () => {
  const result = formatDate(null);
  expect(result).toBe('');
});

test('formatDate formats the date correctly', () => {
  const date = new Date('2023-12-28T12:00:00Z');
  const result = formatDate(date);
  expect(result).toBe('28.12.2023');
});
test('formatDate returns empty string for invalid date', () => {
  const result = formatDate(new Date('invalid-date'));
  expect(result).toBe('');
});
test('formatDate formats leap year date correctly', () => {
  const date = new Date('2020-02-29T12:00:00Z'); // Leap year date
  const result = formatDate(date);
  expect(result).toBe('29.02.2020');
});
test('formatDate formats single-digit day and month correctly', () => {
  const date = new Date('2023-01-05T12:00:00Z'); // January 5, 2023
  const result = formatDate(date);
  expect(result).toBe('05.01.2023');
});
test('formatDate formats future date correctly', () => {
  const date = new Date('2024-06-15T12:00:00Z'); // June 15, 2024
  const result = formatDate(date);
  expect(result).toBe('15.06.2024');
});
