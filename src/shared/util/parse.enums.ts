import { Specialty, PetType, Examination } from '@prisma/client';

export const getSpecialtyEnum = (value: string) => {
  value = value.toUpperCase();
  if (value == 'DOG') return Specialty.DOG;
  if (value == 'CAT') return Specialty.CAT;
  if (value == 'CAT_DOG') return Specialty.CAT_DOG;
  else return Specialty.CAT_DOG;
};

export const getPetTypeEnum = (value: string) => {
  value = value.toUpperCase();
  if (value.toUpperCase() == 'DOG') return PetType.DOG;
  if (value.toUpperCase() == 'CAT') return PetType.CAT;
  if (value.toUpperCase() == 'UNKWON') return PetType.UNKNOWN;
  else return PetType.UNKNOWN;
};

export const getExaminationEnum = (value: string) => {
  value = value.toUpperCase();
  if (value == 'ROUTINE') return Examination.ROUTINE;
  if (value == 'URGENT') return Examination.URGENT;
  if (value == 'SURGERY') return Examination.SURGERY;
  else return Examination.ROUTINE;
};
