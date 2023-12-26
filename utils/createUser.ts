import { setDoc, doc, Firestore } from 'firebase/firestore';
import { formatDate } from '../utils/formatDate';
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
