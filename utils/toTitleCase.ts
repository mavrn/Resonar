/**
 * Partial title case conversion (hello world -> Hello world)
 * @param inputString Input string
 * @returns Partial title case string, '' if string is empty or constists of whitespace
 */
export function toTitleCase(inputString: string): string {
  if (!inputString || !inputString.trim()) {
    return '';
  }
  return (
    inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
  );
}
