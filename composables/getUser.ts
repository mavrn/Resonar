import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

import type { Firestore } from 'firebase/firestore';

export const getUser = async (db: Firestore, username: string) => {
  const users = collection(db, 'users');
  var q = query(users, where('username', '==', username));

  try {
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      let foundUser = snapshot.docs[0];
      return foundUser;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
