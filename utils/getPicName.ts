export function getPicName(filename: string, isDarkMode: Boolean) {
  if (!isDarkMode) {
    return '/_nuxt/assets/' + filename + '-lm.png';
  } else {
    return '/_nuxt/assets/' + filename + '-dm.png';
  }
}
