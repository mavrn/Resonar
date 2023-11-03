import { setDoc, doc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export const createUser = async (
  db: Firestore,
  username: string,
  email: string,
  uid: string
) => {
  const userRef = await setDoc(doc(db, 'users', uid), {
    username: username,
    email: email,
  });
};
