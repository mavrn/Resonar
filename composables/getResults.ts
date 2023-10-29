export const getResults = (
  index: {
    name: string;
    reference: string;
    genre: string;
    year: number;
    type: string;
    relevance: number;
  }[],
  searchQuery: string,
  sort?: { field: string; order: string; type: string },
  localFilter?: Object[]
) => {
  if (!index) {
    return [];
  }
  const results = index.filter((item) =>
    item.name.includes(searchQuery.toLowerCase())
  );
  if (sort) {
    if (sort.field === 'releaseDate') {
      results.sort((a, b) => {
        const aValue: number = a.year;
        const bValue: number = b.year;
        return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
      });
    } else if (sort.field === 'popular') {
      results.sort((a, b) => {
        const aValue: number = a.relevance;
        const bValue: number = b.relevance;
        return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }
  }
  const references = results.map((item) => item.reference);
  console.log(results);
  return references;
};
