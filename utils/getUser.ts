import {
  collection,
  getDocs,
  query,
  where,
  Firestore,
} from 'firebase/firestore';

/**
 * Looks for a user doc that matches a username in DB. Only works for exact matches.
 * @param db Firestore instance
 * @param username Username to look for
 * @returns A document if user was found, null of not
 */
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
