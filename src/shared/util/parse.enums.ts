import { Role, Specialty, PetType, Examination } from '@prisma/client';

export const getRoleEnum = (value: string | undefined) => {
  if (!value) return Role.ANONYMOUS;
  value = value.toUpperCase();
  if (value == 'ADMIN') return Role.ADMIN;
  if (value == 'VET') return Role.VET;
  if (value == 'OWNER') return Role.OWNER;
  else return Role.ANONYMOUS;
};

export const getSpecialtyEnum = (value: string | null) => {
  if (!value) return Specialty.CAT_DOG;
  value = value.toUpperCase();
  if (value == 'DOG') return Specialty.DOG;
  if (value == 'CAT') return Specialty.CAT;
  if (value == 'CAT_DOG') return Specialty.CAT_DOG;
  else return Specialty.CAT_DOG;
};

export const getPetTypeEnum = (value: string | undefined) => {
  if (!value) return PetType.UNKNOWN;
  value = value.toUpperCase();
  if (value.toUpperCase() == 'DOG') return PetType.DOG;
  if (value.toUpperCase() == 'CAT') return PetType.CAT;
  if (value.toUpperCase() == 'UNKWON') return PetType.UNKNOWN;
  else return PetType.UNKNOWN;
};

export const getExaminationEnum = (value: string | undefined) => {
  if (!value) return Examination.ROUTINE;
  value = value.toUpperCase();
  if (value == 'ROUTINE') return Examination.ROUTINE;
  if (value == 'URGENT') return Examination.URGENT;
  if (value == 'SURGERY') return Examination.SURGERY;
  else return Examination.ROUTINE;
};
