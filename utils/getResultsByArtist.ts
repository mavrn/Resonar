
/**
 * Filters an index for a specific artist id. Helper function for the artist page.
 * @param index Input index
 * @param id Artist ID
 * @returns A filtered list of releases matching the artist ID
 */
export const getResultsByArtist = (
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
  id: string
) => {
  if (!index) {
    return [];
  }
  let results = index.filter((item) => item.artist === id);
  results.sort((a, b) => b.year - a.year);
  return results;
};
