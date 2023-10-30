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
  sort?: { field: string; order: number },
  localFilter?: Object[]
) => {
  if (!index) {
    return [];
  }
  console.debug('Filtering...');
  const results = index.filter((item) =>
    item.name.includes(searchQuery.toLowerCase())
  );
  console.log(sort)
  if (sort) {
    console.debug('Sorting...');
    if (sort.field === 'releaseDate') {
      results.sort((a, b) => {
        const aValue: number = a.year;
        const bValue: number = b.year;
        return sort.order === 1 ? aValue - bValue : bValue - aValue;
      });
    } else if (sort.field === 'popular') {
      results.sort((a, b) => {
        const aValue: number = a.relevance;
        const bValue: number = b.relevance;
        return sort.order === 1 ? aValue - bValue : bValue - aValue;
      });
    }
    else if (sort.field === 'alphabetical') {
            results.sort((a, b) => {
                const aValue: string = a.name.toLowerCase();
                const bValue: string = b.name.toLowerCase();
                if (sort.order === -1) {
                    if (aValue < bValue) return -1;
                    if (aValue > bValue) return 1;
                    return 0;
                } else {
                    if (bValue < aValue) return -1;
                    if (bValue > aValue) return 1;
                    return 0;
                }
            });
  }}
  console.debug('Mapping...');
  const references = results.map((item) => item.reference);
  console.debug('Done!');
  return references;
};
