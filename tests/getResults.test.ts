import { test, expect } from 'vitest';
import { getResults } from '../utils/getResults';
import { Filter } from '../utils/Filter';
import { User } from '../utils/User';
import { Firestore } from 'firebase/firestore';

// Mock Firestore and User functions
const mockDb: Firestore = {} as Firestore;
const mockUser: User = {} as User;

// Mock getRatingsByUser function (You can implement a simple mock function if needed)
const mockGetRatingsByUser = () => Promise.resolve([]);

// Mock data
const mockIndex = [
  {
    name: 'Vespertine',
    relevance: 20,
    rating: 8.5,
    artistName: 'ARtist2',
    cover:
      '//e.snmc.io/i/600/w/4ccacc925dae63c8e2172e9aa9da198c/9935583/bjork-vespertine-Cover-Art.jpg',
    type: 'album',
    genres: [
      'Art Pop',
      'Electronic',
      'Ambient Pop',
      'Glitch Pop',
      'Microsound',
      'Folktronica',
    ],
    reference: 'releases/RVqqPiRzDFilRB23jkVq',
    year: 1900,
  },
  {
    name: 'Homogenic',
    relevance: 48,
    rating: 8.28,
    artistName: 'Artist1',
    cover:
      '//e.snmc.io/i/600/w/e8b1bb9998bc61106b5896cd4b12beb3/8697079/bjork-homogenic-Cover-Art.jpg',
    type: 'album',
    genres: [
      'Art Pop',
      'Electronic',
      'Trip Hop',
      'IDM',
      'Glitch Pop',
      'Chamber Music',
      'Chamber Pop',
    ],
    reference: 'releases/yXiKAJppPkgtf8qjVPo7',
    year: 2000,
  },
  {
    name: 'The Money Store',
    relevance: 35,
    rating: 8.2,
    artistName: 'Death Grips',
    cover: 'https://e.snmc.io/3.0/img/blocked_art/enable_img_600x600.png',
    type: 'album',
    genres: [
      'Industrial Hip Hop',
      'Hardcore Hip Hop',
      'Experimental Hip Hop',
      'Glitch Hop',
      'Abstract Hip Hop',
    ],
    reference: 'releases/15Z47YncX0I6BxTnuouw',
    year: 2000,
  },
];

const mockFilter = new Filter(
  'albums',
  [8, 10],
  [1995, 2005],
  false,
  false,
  'relevance',
  -1
);

// Test cases for getResults function
test('getResults returns filtered results based on yearRange and ratingRange criteria', async () => {
  const results = await getResults(mockDb, mockIndex, '', mockFilter, mockUser);
  expect(results).toHaveLength(2);
  expect(results[1].name).toBe('The Money Store');
  expect(results[0].name).toBe('Homogenic');
});

test('search query: release', async () => {
  const results = await getResults(mockDb, mockIndex, 'homo', null, mockUser);
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('Homogenic');
});

test('search query: artist', async () => {
  const results = await getResults(mockDb, mockIndex, 'death', null, mockUser);
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('The Money Store');
});

test('search query: artist', async () => {
  const results = await getResults(mockDb, mockIndex, 'Ambient', null, mockUser);
  expect(results).toHaveLength(1);
  expect(results[0].name).toBe('Vespertine');
});

test('getResults returns sorted results based on sorting criteria', async () => {
  const results = await getResults(mockDb, mockIndex, '', mockFilter, mockUser);
  expect(results).toHaveLength(2);
  expect(results[0].name).toBe('Homogenic'); // 'Homogenic' has higher relevance (48) than 'Vespertine' (20)
  expect(results[1].name).toBe('The Money Store');
});

// ... Add more test cases as needed
