import { Filter } from '../utils/Filter';

export const getResults = (
  index: {
    name: string;
    artist: string;
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
  sorting?: { field: string; order: number },
  filtering?: Filter
) => {

  console.log(index);
  if (!index) {
    return [];
  }
  console.debug('Filtering...');
  searchQuery = searchQuery.toLowerCase();
  let results = index.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery) ||
      item.artist?.toLowerCase().includes(searchQuery)
  );
  if (filtering) {
    if (filtering.type != 'all') {
      if (filtering.type == 'releases') {
        results = results.filter((item) => ['album', 'single'].includes(item.type));
      } else {
        results = results.filter(
          (item) => item.type === filtering.type.slice(0, -1)
        );
      }
    }
    if (filtering.genres.length != 0 && filtering.genres[0] != '') {
      results = results.filter((item) =>
        item.genres.every((genre) => filtering.genres.includes(genre))
      );
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
  }
  if (sorting) {
    console.debug('Sorting...');
    if (sorting.field === 'releaseDate') {
      results.sort((a, b) => {
        const aValue: number = a.year;
        const bValue: number = b.year;
        return sorting.order === 1 ? aValue - bValue : bValue - aValue;
      });
    } else if (sorting.field === 'popular') {
      results.sort((a, b) => {
        const aValue: number = a.relevance;
        const bValue: number = b.relevance;
        return sorting.order === 1 ? aValue - bValue : bValue - aValue;
      });
    } else if (sorting.field === 'rating') {
      results.sort((a, b) => {
        const aValue: number = a.rating;
        const bValue: number = b.rating;
        return sorting.order === 1 ? aValue - bValue : bValue - aValue;
      });
    } else if (sorting.field === 'alphabetical') {
      results.sort((a, b) => {
        const aValue: string = a.name.toLowerCase();
        const bValue: string = b.name.toLowerCase();
        if (sorting.order === -1) {
          if (aValue < bValue) return -1;
          if (aValue > bValue) return 1;
          return 0;
        } else {
          if (bValue < aValue) return -1;
          if (bValue > aValue) return 1;
          return 0;
        }
      });
    }
  }
  console.debug('Done!');
  return results;
};
