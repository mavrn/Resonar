import { User } from './User';
import { query, collection, Firestore, getDocs } from 'firebase/firestore';

/**
 * Fetches a a list of a user's ratings from DB
 * @param db Firestore instance
 * @param user User instance
 * @returns A list of Firestore rating docs
 */
export const getRatingsByUser = async (db: Firestore, user: User) => {
  console.log(user);
  const ratings = collection(db, 'users/' + user.uid + '/ratings');
  const ratingsQuery = query(ratings);
  return (await getDocs(ratingsQuery)).docs;
};
