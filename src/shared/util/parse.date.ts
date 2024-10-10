export const convertToISODate = (date: string): string => {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};

export const getDateRangeForDay = (
  dateString: string
): { start: Date; end: Date } => {
  // Converte a string para YYYY-MM-DD
  const [year, month, day] = dateString.split('-').map(Number);

  // Data inicial: 00:00:00 do dia
  const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

  // Data final: 23:59:59 do dia
  const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59));

  return { start, end };
};
