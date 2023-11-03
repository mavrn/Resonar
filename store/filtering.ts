export const useFilteringStore = defineStore('filtering', {
  state: () => ({
    filtering: new Filter('all', [], [0, 10], [1950, 2023], false, false),
  }),
});
