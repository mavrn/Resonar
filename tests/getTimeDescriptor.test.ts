import { test, expect } from 'vitest';
import { getTimeDescriptor } from '../utils/getTimeDescriptor';
// Test case for seconds
test('getTimeDescriptor returns correct descriptor for seconds', () => {
  const now = new Date();
  const date = new Date(now.getTime() - 5000); // 5 seconds ago
  const descriptor = getTimeDescriptor(date);
  expect(descriptor).toBe('5 seconds ago');
});

// Test case for minutes
test('getTimeDescriptor returns correct descriptor for minutes', () => {
  const now = new Date();
  const date = new Date(now.getTime() - 120000); // 2 minutes ago
  const descriptor = getTimeDescriptor(date);
  expect(descriptor).toBe('2 minutes ago');
});

// Test case for hours
test('getTimeDescriptor returns correct descriptor for hours', () => {
  const now = new Date();
  const date = new Date(now.getTime() - 7200000); // 2 hours ago
  const descriptor = getTimeDescriptor(date);
  expect(descriptor).toBe('2 hours ago');
});

// Test case for days
test('getTimeDescriptor returns correct descriptor for days', () => {
  const now = new Date();
  const date = new Date(now.getTime() - 172800000); // 2 days ago
  const descriptor = getTimeDescriptor(date);
  expect(descriptor).toBe('2 days ago');
});

// Test case for weeks
test('getTimeDescriptor returns correct descriptor for weeks', () => {
  const now = new Date();
  const date = new Date(now.getTime() - 1209600000); // 2 weeks ago
  const descriptor = getTimeDescriptor(date);
  expect(descriptor).toBe('2 weeks ago');
});

// Test case for months
test('getTimeDescriptor returns correct descriptor for months', () => {
  const now = new Date();
  const date = new Date(now.getTime() - 5184000000); // 2 months ago
  const descriptor = getTimeDescriptor(date);
  expect(descriptor).toBe('2 months ago');
});

// Test case for years
test('getTimeDescriptor returns correct descriptor for years', () => {
  const now = new Date();
  const date = new Date(now.getTime() - 63072000000); // 2 years ago
  const descriptor = getTimeDescriptor(date);
  expect(descriptor).toBe('2 years ago');
});