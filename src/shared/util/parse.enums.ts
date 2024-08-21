import { Specialty } from '@prisma/client';

export const getSpecialtyEnum = (value: string) => {
  if (value == 'DOG') return Specialty.DOG;
  if (value == 'CAT') return Specialty.CAT;
  if (value == 'CAT_DOG') return Specialty.CAT_DOG;
  else return Specialty.CAT_DOG;
};
