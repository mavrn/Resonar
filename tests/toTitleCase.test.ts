import { test, expect } from 'vitest';
import { toTitleCase } from '../utils/toTitleCase';

test('toTitleCase converts a lowercase string to title case', () => {
  const input = 'hello world';
  const expectedOutput = 'Hello world';
  const result = toTitleCase(input);
  expect(result).toBe(expectedOutput);
});

test('toTitleCase converts an uppercase string to title case', () => {
  const input = 'FOO BAR BAZ';
  const expectedOutput = 'Foo bar baz';
  const result = toTitleCase(input);
  expect(result).toBe(expectedOutput);
});

test('toTitleCase handles mixed cases and converts to title case', () => {
  const input = 'tHiS iS A tEsT';
  const expectedOutput = 'This is a test';
  const result = toTitleCase(input);
  expect(result).toBe(expectedOutput);
});

test('toTitleCase returns an empty string for empty input', () => {
  const input = '';
  const expectedOutput = '';
  const result = toTitleCase(input);
  expect(result).toBe(expectedOutput);
});

test('toTitleCase returns an empty string for whitespace input', () => {
  const input = '    ';
  const expectedOutput = '';
  const result = toTitleCase(input);
  expect(result).toBe(expectedOutput);
});
