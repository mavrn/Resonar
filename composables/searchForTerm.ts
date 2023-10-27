import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  endAt,
  startAt,
} from 'firebase/firestore';

export const searchForTerm = async (searchQuery: string) => {
  searchQuery = searchQuery.toLowerCase();
  const db = useFirestore();
  const index = collection(db, 'index');
  var q = query(
    index,
    orderBy('name'),
    startAt(searchQuery),
    endAt(searchQuery + '~')
  );
  try {
    const snapshot = await getDocs(q);
    return snapshot;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
