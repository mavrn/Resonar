import { test, expect } from 'vitest';
import { Artist } from '../utils/Artist';

// Test cases for the Artist class
test('Artist constructor sets properties from DocumentData', () => {
  const docData = {
    id: '123',
    data: () => ({
      picture: 'avatar-url',
      name: 'Artist Name',
    }),
  };
  const artist = new Artist(docData);
  expect(artist.uid).toBe('123');
  expect(artist.avatar).toBe('avatar-url');
  expect(artist.name).toBe('Artist Name');
});

test('Artist constructor handles undefined DocumentData', () => {
  const artist = new Artist();
  expect(artist.uid).toBeUndefined();
  expect(artist.avatar).toBeUndefined();
  expect(artist.name).toBeUndefined();
});

test('resolveAllLocal sets properties correctly', () => {
  const artist = new Artist();
  artist.resolveAllLocal('456', 'new-avatar-url', 'New Artist Name');
  expect(artist.uid).toBe('456');
  expect(artist.avatar).toBe('new-avatar-url');
  expect(artist.name).toBe('New Artist Name');
});

test('resolveAllLocal handles empty values', () => {
  const artist = new Artist();
  artist.resolveAllLocal('', '', '');
  expect(artist.uid).toBe('');
  expect(artist.avatar).toBe('');
  expect(artist.name).toBe('');
});

test('resolveAllLocal handles partial values', () => {
  const artist = new Artist();
  artist.resolveAllLocal('789', '', 'Partial Artist Name');
  expect(artist.uid).toBe('789');
  expect(artist.avatar).toBe('');
  expect(artist.name).toBe('Partial Artist Name');
});

// ... Add more test cases as needed
