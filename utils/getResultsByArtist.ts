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
  searchQuery: string
) => {
  if (!index) {
    return [];
  }
  let results = index.filter(
    (item) => item.artist?.toLowerCase() === searchQuery.toLowerCase()
  );
  results.sort((a, b) => b.year - a.year);
  return results;
};
