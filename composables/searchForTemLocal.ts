export const searchForTermLocal = (
  index: { name: string; reference: string }[],
  searchQuery: string
) => {
  if (!index) {
    return [];
  }
  const results = index.filter((item) =>
    item.name.includes(searchQuery.toLowerCase())
  );
  const references = results.map((item) => item.reference);
  return references;
};
