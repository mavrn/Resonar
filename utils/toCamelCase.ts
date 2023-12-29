/**
 * @param inputString Input string
 * @returns String toCamelCase
 */
export function toCamelCase(inputString: string) {
  return inputString
    .replace(/\s(.)/g, (_, match) => match.toUpperCase())
    .replace(/\s/g, '')
    .replace(/^(.)/, (match) => match.toLowerCase());
}
