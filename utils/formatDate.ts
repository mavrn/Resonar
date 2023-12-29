/**
 * @param date TS Date Instance
 * @returns Date as string formatted as DD.MM.YYYY
 */
export function formatDate(date: Date) {
  if (!date || isNaN(date.getTime())) {
    return '';
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}
