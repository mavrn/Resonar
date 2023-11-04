import { setDoc, doc, Firestore } from 'firebase/firestore';

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
