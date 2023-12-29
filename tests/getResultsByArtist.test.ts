import { test, expect } from 'vitest';
import { getResultsByArtist } from '../utils/getResultsByArtist';

const mockIndex = [
  {
    name: 'Vespertine',
    artist: 'Bjork',
    year: 2001,
  },
  {
    name: 'Homogenic',
    artist: 'Bjork',
    year: 1997,
  },
  {
    name: 'Random Album',
    artist: 'Other Artist',
    year: 2005,
  },
];

test('getResultsByArtist returns filtered and sorted results based on artist ID', () => {
  const results = getResultsByArtist(mockIndex, 'Bjork');
  expect(results).toHaveLength(2);
  expect(results[0].name).toBe('Vespertine');
  expect(results[1].name).toBe('Homogenic');
});
test('getResultsByArtist returns an empty array when no matching artist is found', () => {
  const results = getResultsByArtist(mockIndex, 'Unknown Artist');
  expect(results).toHaveLength(0);
});

test('getResultsByArtist handles an empty index', () => {
  const results = getResultsByArtist([], 'Bjork');
  expect(results).toHaveLength(0);
});
