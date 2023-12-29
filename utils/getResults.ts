import { Filter } from './Filter';
import { User } from './User';
import { getRatingsByUser } from './getRatingsByUser';
import { Firestore, QueryDocumentSnapshot } from 'firebase/firestore';
/**
 * Finds the rating out of an Rating doc array that has a matching targetID
 * @param snapshots List of Rating Documents
 * @param targetID ID to look for
 * @returns Rating of the found document, null if none was found
 */
function getRatingById(snapshots: QueryDocumentSnapshot[], targetID: string) {
  return snapshots.find((snapshot) => snapshot.id === targetID)?.data().rating;
}

/**
 * Filters an index by a search query and a Filter object
 * @param db Firestore instance
 * @param index Index to search in
 * @param searchQuery Search query
 * @param filtering Filter object
 * @param currentUser Currently logged in user, can be null
 * @returns A filtered list of results
 */
export const getResults = async (
  db: Firestore,
  index: {
    name: string;
    artistName: string;
    reference: string;
    genres: string[];
    year: number;
    type: string;
    relevance: number;
    rating: number;
    cover?: string;
    picture?: string;
  }[],
  searchQuery: string,
  filtering: Filter,
  currentUser: User
) => {
  if (!index) {
    return [];
  }
  console.log(filtering);
  console.debug('Filtering...');

  //filtering for the search query
  searchQuery = searchQuery.toLowerCase();
  let results = index.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery) || //looking in item title, artist and genres
      item.artistName?.toLowerCase().includes(searchQuery) ||
      item.genres?.some((str) => str?.toLowerCase()?.includes(searchQuery))
  );
  //applying a filter instance
  if (filtering) {
    if (filtering.type != 'all') {
      if (filtering.type == 'releases') {
        results = results.filter((item) =>
          ['album', 'single'].includes(item.type)
        );
      } else {
        results = results.filter(
          (item) => item.type === filtering.type.slice(0, -1)
        );
      }
    }
    if (filtering.yearRange[0] != 1950 || filtering.yearRange[1] != 2023) {
      results = results.filter(
        (item) =>
          filtering.yearRange[0] <= item.year &&
          item.year <= filtering.yearRange[1]
      );
    }
    if (filtering.ratingRange[0] != 0 || filtering.ratingRange[1] != 10) {
      results = results.filter(
        (item) =>
          filtering.ratingRange[0] <= item.rating &&
          item.rating <= filtering.ratingRange[1]
      );
    }
    if (
      (filtering.inRated || filtering.sorting == 'Your Rating') &&
      currentUser
    ) {
      const currentUserRatedDocs = await getRatingsByUser(db, currentUser);
      console.log(currentUserRatedDocs);
      results = results.filter((result) => {
        const referencePart = result.reference.split('/')[1];
        return currentUserRatedDocs?.some((doc) => doc.id === referencePart);
      });
    }
  }

  //applying sorting
  if (filtering && filtering.sorting) {
    console.debug('Sorting...');
    if (filtering.sorting === 'Release Date') {
      results.sort((a, b) => {
        const aValue: number = a.year;
        const bValue: number = b.year;
        return filtering.sortingOrder === 1 ? aValue - bValue : bValue - aValue;
      });
    } else if (filtering.sorting === 'Relevance') {
      results.sort((a, b) => {
        const aValue: number = a.relevance;
        const bValue: number = b.relevance;
        return filtering.sortingOrder === 1
          ? aValue - bValue
          : bValue - aValue;
      });
    } else if (filtering.sorting === 'Rating') {
      results.sort((a, b) => {
        const aValue: number = a.rating;
        const bValue: number = b.rating;
        return filtering.sortingOrder === 1 ? aValue - bValue : bValue - aValue;
      });
    } else if (filtering.sorting === 'Alphabetical') {
      results.sort((a, b) => {
        const aValue: string = a.name.toLowerCase();
        const bValue: string = b.name.toLowerCase();
        if (filtering.sortingOrder === -1) {
          if (aValue < bValue) return -1;
          if (aValue > bValue) return 1;
          return 0;
        } else {
          if (bValue < aValue) return -1;
          if (bValue > aValue) return 1;
          return 0;
        }
      });
    } else if (filtering.sorting === 'Your Rating') {
      const currentUserRatedDocs = await getRatingsByUser(db, currentUser);
      results.sort((a, b) => {
        const aValue = getRatingById(
          currentUserRatedDocs,
          a.reference.split('/')[1]
        );
        const bValue = getRatingById(
          currentUserRatedDocs,
          b.reference.split('/')[1]
        );
        return filtering.sortingOrder === 1 ? aValue - bValue : bValue - aValue;
      });
    }
  }
  console.debug('Done!');
  return results;
};
