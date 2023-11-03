import { updateDoc, doc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

export const updateUser = async (db: Firestore, id: string, fields: Object) => {
  const userRef = await updateDoc(doc(db, 'users', id), fields);
};
