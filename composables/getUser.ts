import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';

export const getUser = async (username: string) => {
  const db = useFirestore();
  const users = collection(db, 'users');
  var q = query(users, where('username', '==', username));

  try {
    const snapshot = await getDocs(q);
    if (snapshot.docs.length > 0) {
      let foundUser = snapshot.docs[0];
      return foundUser;
    } else {
      console.log('Didnt find user');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
