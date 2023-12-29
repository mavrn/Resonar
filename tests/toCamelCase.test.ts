import { test, expect } from 'vitest';
import { toCamelCase } from '../utils/toCamelCase';

test('toCamelCase converts a string with spaces to camel case', () => {
  const input = 'hello world';
  const expectedOutput = 'helloWorld';
  const result = toCamelCase(input);
  expect(result).toBe(expectedOutput);
});

test('toCamelCase handles multiple spaces and converts to camel case', () => {
  const input = 'foo bar baz';
  const expectedOutput = 'fooBarBaz';
  const result = toCamelCase(input);
  expect(result).toBe(expectedOutput);
});

test('toCamelCase handles mixed cases and converts to camel case', () => {
  const input = 'This is a Test';
  const expectedOutput = 'thisIsATest';
  const result = toCamelCase(input);
  expect(result).toBe(expectedOutput);
});