import {
  AppointmentStatus,
  Examination,
  Appointment as PrismaAppointment,
  Pet as PrismaPet,
} from '@prisma/client';
import { Pet } from './pet.entity';

export class Appointment {
  public readonly id: string;
  public readonly date: Date;
  public readonly hour: string;
  public readonly status: AppointmentStatus;
  public readonly examination: Examination;
  public readonly observations: string;
  public readonly vetID: string;
  public readonly petID: string;
  public readonly ownerID: string;
  public readonly createdAt?: Date | null;
  public readonly updatedAt?: Date | null;
  public readonly pet: Pet;

  constructor(
    id: string,
    date: Date,
    hour: string,
    status: AppointmentStatus,
    examination: Examination,
    observations: string,
    vetID: string,
    petID: string,
    ownerID: string,
    createdAt: Date | null,
    updatedAt: Date | null,
    pet: Pet
  ) {
    this.id = id;
    this.date = date;
    this.hour = hour;
    this.status = status;
    this.examination = examination;
    this.observations = observations;
    this.vetID = vetID;
    this.petID = petID;
    this.ownerID = ownerID;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.pet = pet;
  }

  public static mapFromPrisma(
    prismaAppointment: PrismaAppointment,
    prismaPet: PrismaPet
  ): Appointment {
    return new Appointment(
      prismaAppointment.id,
      prismaAppointment.date,
      prismaAppointment.hour,
      prismaAppointment.status,
      prismaAppointment.examination,
      prismaAppointment.observations,
      prismaAppointment.vetID,
      prismaAppointment.petID,
      prismaAppointment.ownerID,
      prismaAppointment.createdAt,
      prismaAppointment.updatedAt,
      Pet.mapFromPrisma(prismaPet)
    );
  }
}
