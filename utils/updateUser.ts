import { updateDoc, doc, Firestore } from 'firebase/firestore';

/**
 * Updates a remote user doc with any fields
 * @param db Firestore instance
 * @param id User ID / Doc ID
 * @param fields Fields to update, can by anything. Example {location: Germany, picture: 'avatar.jpg'}
 */
export const updateUser = async (db: Firestore, id: string, fields: Object) => {
  const userRef = await updateDoc(doc(db, 'users', id), fields);
};
