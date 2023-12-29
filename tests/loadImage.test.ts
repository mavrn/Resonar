import { test, expect } from 'vitest';
import './setupFirebase'
import { loadImage } from '../utils/loadImage';



test('loadImage works on avatar.jpg', async () => {
  const image = await loadImage('avatar.jpg');
  expect(image).toBeDefined();
  expect(typeof image).toBe('string');
  expect(image.startsWith('data:image')).toBe(true);
  expect(image.length).toBeGreaterThanOrEqual(1000);
});
