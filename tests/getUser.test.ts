import { test, expect } from 'vitest';
import { useFirestore } from 'vuefire';
import { getUser } from '../utils/getUser';
import './setupFirebase'

const db = useFirestore();

test('getUser returns correct user document when matching username is found', async () => {
  const user = await getUser(db, 'admin');
  expect(user).toBeDefined();
  expect(user?.data().username).toBe('admin');
  expect(user?.data().created).toBe('25.10.2023');
  expect(user?.data().location).toBe('Germany');
  expect(user?.data().picture).toBe('avatar.jpg');
});

test('getUser returns null when no matching username is found', async () => {
  const user = await getUser(db, 'nonexistentUser');
  expect(user).toBeNull();
});