export const parseBoolean = (value: string) => {
  return value === 'true' ? true : value === 'false' ? false : undefined;
};
