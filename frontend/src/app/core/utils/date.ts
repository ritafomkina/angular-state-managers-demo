export function shortDate(date: Date | string | null | undefined): string | void {
  if (!date || typeof date === 'string') {
    return date || undefined;
  }

  const offset = date.getTimezoneOffset();
  const formattedDate = new Date(date.getTime() - offset * 60 * 1000);

  return formattedDate.toISOString().split('T')[0];
}

export function parseDate(dateInput: string | Date | null | undefined): string | null {
  if (!dateInput) {
    return null;
  }

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
