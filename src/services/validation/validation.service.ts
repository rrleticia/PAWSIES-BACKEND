import { ValidationError } from 'joi';
import { Validators } from '../../models';
import { Appointment, LoginUser, Owner, Pet, User, Vet } from '../../infra';
import {
  AppointmentValidationError,
  LoginValidationError,
  OwnerValidationError,
  PetValidationError,
  UserValidationError,
  VetValidationError,
} from '../../errors';

export const schemaLoginValidation = async (data: any): Promise<LoginUser> => {
  try {
    const body = await Validators['LoginModel'].validateAsync(data, {
      warnings: true,
    });

    return body.value as User;
  } catch (error: any) {
    error = error as ValidationError;

    throw new LoginValidationError(
      `Invalid input for a field of Login. Joi raises: ${error.details.map(
        (detail: any) => {
          return detail.message.replaceAll('"', '');
        }
      )}`,
      405
    );
  }
};

export const schemaUserValidation = async (data: any): Promise<User> => {
  try {
    const body = await Validators['UserModel'].validateAsync(data, {
      warnings: true,
    });

    return body.value as User;
  } catch (error: any) {
    error = error as ValidationError;

    throw new UserValidationError(
      `Invalid input for a field of User. Joi raises: ${error.details.map(
        (detail: any) => {
          return detail.message.replaceAll('"', '');
        }
      )}`,
      405
    );
  }
};

export const schemaVetValidation = async (data: any): Promise<Vet> => {
  try {
    const body = await Validators['VetModel'].validateAsync(data, {
      warnings: true,
    });
    return body.value as Vet;
  } catch (error: any) {
    error = error as ValidationError;

    throw new VetValidationError(
      `Invalid input for a field of Vet. Joi raises: ${error.details.map(
        (detail: any) => {
          return detail.message.replaceAll('"', '');
        }
      )}`,
      405
    );
  }
};

export const schemaOwnerValidation = async (data: any): Promise<Owner> => {
  try {
    const body = await Validators['OwnerModel'].validateAsync(data, {
      warnings: true,
    });

    return body.value as Owner;
  } catch (error: any) {
    error = error as ValidationError;
    console.log(error);
    throw new OwnerValidationError(
      `Invalid input for a field of Owner. Joi raises: ${error.details.map(
        (detail: any) => {
          return detail.message.replaceAll('"', '');
        }
      )}`,
      405
    );
  }
};

export const schemaPetValidation = async (data: any): Promise<Pet> => {
  try {
    const body = await Validators['PetModel'].validateAsync(data, {
      warnings: true,
    });

    return body.value as Pet;
  } catch (error: any) {
    error = error as ValidationError;

    throw new PetValidationError(
      `Invalid input for a field of Owner. Joi raises: ${error.details.map(
        (detail: any) => {
          return detail.message.replaceAll('"', '');
        }
      )}`,
      405
    );
  }
};

export const _schemaAppointmentValidation = async (
  data: any
): Promise<Appointment> => {
  try {
    const body = await Validators['AppointmentModel'].validateAsync(data, {
      warnings: true,
    });

    return body.value as Appointment;
  } catch (error: any) {
    error = error as ValidationError;

    throw new AppointmentValidationError(
      `Invalid input for a field of Owner. Joi raises: ${error.details.map(
        (detail: any) => {
          return detail.message.replaceAll('"', '');
        }
      )}`,
      405
    );
  }
};
