import { Specialty, PetType } from '@prisma/client';

export const getSpecialtyEnum = (value: string) => {
  if (value == 'DOG') return Specialty.DOG;
  if (value == 'CAT') return Specialty.CAT;
  if (value == 'CAT_DOG') return Specialty.CAT_DOG;
  else return Specialty.CAT_DOG;
};

export const getPetTypeEnum = (value: string) => {
  if (value == 'DOG') return PetType.DOG;
  if (value == 'CAT') return PetType.CAT;
  if (value == 'UNKWON') return PetType.UNKNOWN;
  else return PetType.UNKNOWN;
};
