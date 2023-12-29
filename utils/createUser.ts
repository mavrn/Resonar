import { setDoc, doc, Firestore } from 'firebase/firestore';
import { formatDate } from '../utils/formatDate';

/**
 * Creates a user in Firestore
 * @param db Firestore instance
 * @param username Username
 * @param email E-Mail
 * @param uid Unique User ID
 * @export
 */
export const createUser = async (
  db: Firestore,
  username: string,
  email: string,
  uid: string
) => {
  const userRef = await setDoc(doc(db, 'users', uid), {
    username: username,
    email: email,
    created: formatDate(new Date()),
  });
};
