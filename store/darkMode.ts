/**
 * Pinia store for managing the dark mode
 */
export const useDarkModeStore = defineStore('filtering', {
  state: () => ({
    isDark: false,
  }),
});
