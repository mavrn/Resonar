export function toTitleCase(inputString: string): string {
  if (!inputString || !inputString.trim()) {
    return '';
  }
  return (
    inputString.charAt(0).toUpperCase() + inputString.slice(1).toLowerCase()
  );
}
