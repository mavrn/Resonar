import { test, expect } from 'vitest';
import { Comment } from '../utils/Comment';
import { User } from '../utils/User';
import { Release } from '../utils/Release';

// Test cases for the Comment class
test('Comment constructor sets properties correctly', () => {
  const user = new User();
  const release = new Release();
  const comment = new Comment(
    'comment1',
    'Comment Content',
    1631232000, // September 10, 2021
    [],
    4,
    release,
    user,
    null,
    'avatar-url'
  );

  expect(comment.uid).toBe('comment1');
  expect(comment.content).toBe('Comment Content');
  expect(comment.created.toISOString()).toBe('2021-09-10T00:00:00.000Z');
  expect(comment.replies).toEqual([]);
  expect(comment.rating).toBe(4);
  expect(comment.release).toBe(release);
  expect(comment.user).toBe(user);
  expect(comment.parent).toBeNull();
  expect(comment.picture).toBe('avatar-url');
});

test('Comment constructor handles optional properties', () => {
  const comment = new Comment('comment2', 'Comment Content', 1631232000);

  expect(comment.uid).toBe('comment2');
  expect(comment.content).toBe('Comment Content');
  expect(comment.created.toISOString()).toBe('2021-09-10T00:00:00.000Z');
  expect(comment.replies).toBeUndefined();
  expect(comment.rating).toBeUndefined();
  expect(comment.release).toBeUndefined();
  expect(comment.user).toBeUndefined();
  expect(comment.parent).toBeUndefined();
  expect(comment.picture).toBeUndefined();
});