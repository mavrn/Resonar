import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

export const searchForTerm = async (searchQuery: string, level = 0) => {
  let field = '';
  switch (level) {
    case 0:
      field = 'name';
      break;
    case 1:
      field = 'subnoun1';
      break;
    case 2:
      field = "subnoun2";
      break;
    case 3:
      field = "subnoun3";
      break;
  }

  searchQuery = searchQuery.toLowerCase();
  const db = useFirestore();
  const index = collection(db, 'index');

  var q = query(
    index,
    where(field, '>=', searchQuery),
    where(field, '<=', searchQuery + '\uf8ff')
  );

  try {
    const snapshot = await getDocs(q);
    return snapshot;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
