import { updateDoc, doc, Firestore } from 'firebase/firestore';

export const updateUser = async (db: Firestore, id: string, fields: Object) => {
  const userRef = await updateDoc(doc(db, 'users', id), fields);
};
