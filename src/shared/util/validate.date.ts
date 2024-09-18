export const validateDate = (requestDate: Date): boolean => {
  const currentDate = new Date();
  if (requestDate < currentDate) return false;
  else return true;
};
