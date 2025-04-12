import {
  Role,
  Specialty,
  PetType,
  Examination,
  AppointmentStatus,
} from '@prisma/client';

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

  switch (value) {
    case 'CHECK_UP':
      return Examination.CHECK_UP;
    case 'FOLLOW_UP':
      return Examination.FOLLOW_UP;
    case 'ROUTINE':
      return Examination.ROUTINE;
    case 'URGENT':
      return Examination.URGENT;
    case 'EMERGENCY':
      return Examination.EMERGENCY;
    case 'LAB_TESTS':
      return Examination.LAB_TESTS;
    case 'X_RAY':
      return Examination.X_RAY;
    case 'ULTRASOUND':
      return Examination.ULTRASOUND;
    case 'SURGERY':
      return Examination.SURGERY;
    case 'VACCINATION':
      return Examination.VACCINATION;
    default:
      return Examination.ROUTINE;
  }
};

export const getAppointmentStatusEnum = (value: string | undefined) => {
  if (!value) return AppointmentStatus.SCHEDULED;

  value = value.toUpperCase();

  switch (value) {
    case 'SCHEDULED':
      return AppointmentStatus.SCHEDULED;
    case 'CONFIRMED':
      return AppointmentStatus.CONFIRMED;
    case 'RESCHEDULED':
      return AppointmentStatus.RESCHEDULED;
    case 'CANCELLED':
      return AppointmentStatus.CANCELLED;
    case 'COMPLETED':
      return AppointmentStatus.COMPLETED;
    case 'NO_SHOW':
      return AppointmentStatus.NO_SHOW;
    case 'IN_PROGRESS':
      return AppointmentStatus.IN_PROGRESS;
    default:
      return AppointmentStatus.SCHEDULED;
  }
};
