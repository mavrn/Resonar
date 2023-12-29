/**
 * Handles getting the theme from local storage and saving it into the document data
 */
export function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
}
