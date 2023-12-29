/**
 * Pinia store for managing the currently selected Filter
 */
export const useFilteringStore = defineStore('isDark', {
  state: () => ({
    filtering: new Filter(
      'all',
      [0, 10],
      [1950, 2023],
      false,
      false,
      'Relevance',
      -1
    ),
  }),
});
