import { User } from './User';
import { query, collection, Firestore, getDocs } from 'firebase/firestore';

export const getRatingsByUser = async (db: Firestore, user: User) => {
  console.log(user);
  const ratings = collection(db, 'users/' + user.uid + '/ratings');
  const ratingsQuery = query(ratings);
  return (await getDocs(ratingsQuery)).docs;
};
