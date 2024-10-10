import { PrismaClient } from '@prisma/client';
import { IAppointmentRepository } from '.';
import { Appointment } from '../../entities';
import {
  getAppointmentStatusEnum,
  getDateRangeForDay,
  getExaminationEnum,
} from '../../../shared';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Appointment[] | undefined> {
    const appointments = await this.prisma.appointment.findMany({
      include: { pet: true },
    });

    if (!appointments) return undefined;

    const parseAppointments = appointments.map((appointment) => {
      return Appointment.mapFromPrisma(appointment, appointment.pet);
    });

    return parseAppointments;
  }

  public async findAllByPetID(
    petID: string
  ): Promise<Appointment[] | undefined> {
    const appointments = await this.prisma.appointment.findMany({
      where: { petID: petID },
      include: { pet: true },
    });

    if (!appointments) return undefined;

    const parseAppointments = appointments.map((appointment) => {
      return Appointment.mapFromPrisma(appointment, appointment.pet);
    });

    return parseAppointments;
  }

  public async findOneByID(id: string): Promise<Appointment | undefined> {
    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id: id,
      },
      include: { pet: true },
    });

    if (!appointment) return undefined;

    const parseAppointment = Appointment.mapFromPrisma(
      appointment,
      appointment.pet
    );

    return parseAppointment;
  }

  public async save(appointment: Appointment): Promise<Appointment> {
    const createdAppointment = await this.prisma.appointment.create({
      data: {
        date: appointment.date,
        hour: appointment.hour,
        status: getAppointmentStatusEnum(appointment.status),
        examination: getExaminationEnum(appointment.examination),
        observations: appointment.observations,
        vetID: appointment.vetID,
        petID: appointment.petID,
        ownerID: appointment.ownerID,
      },
      include: { pet: true },
    });

    const parseAppointment = Appointment.mapFromPrisma(
      createdAppointment,
      createdAppointment.pet
    );

    return parseAppointment;
  }

  public async update(
    id: string,
    appointment: Appointment
  ): Promise<Appointment> {
    const updatedAppointment = await this.prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        date: appointment.date,
        hour: appointment.hour,
        status: getAppointmentStatusEnum(appointment.status),
        examination: getExaminationEnum(appointment.examination),
        observations: appointment.observations,
        vetID: appointment.vetID,
        petID: appointment.petID,
        ownerID: appointment.ownerID,
      },
      include: { pet: true },
    });

    const parseAppointment = Appointment.mapFromPrisma(
      updatedAppointment,
      updatedAppointment.pet
    );

    return parseAppointment;
  }

  public async updateStatus(id: string, status: string): Promise<Appointment> {
    const updatedAppointment = await this.prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        status: getAppointmentStatusEnum(status),
      },
      include: { pet: true },
    });

    const parseAppointment = Appointment.mapFromPrisma(
      updatedAppointment,
      updatedAppointment.pet
    );

    return parseAppointment;
  }

  public async delete(id: string): Promise<Appointment> {
    const appointment = await this.prisma.appointment.delete({
      where: {
        id: id,
      },
      include: { pet: true },
    });

    const parseAppointment = Appointment.mapFromPrisma(
      appointment,
      appointment.pet
    );

    return parseAppointment;
  }

  public async findAnyByVetAndOwnerWithDateAndHour(
    vetID: string,
    ownerID: string,
    date: Date,
    hour: string
  ): Promise<Appointment | undefined> {
    const vetAppointment = await this.prisma.appointment.findFirst({
      where: { vetID: vetID, date: date, hour: hour },
      include: { pet: true },
    });

    if (vetAppointment) {
      const parseAppointment = Appointment.mapFromPrisma(
        vetAppointment,
        vetAppointment.pet
      );
      return parseAppointment;
    }

    const ownerAppointment = await this.prisma.appointment.findFirst({
      where: { ownerID: ownerID, date: date, hour: hour },
      include: { pet: true },
    });

    if (ownerAppointment) {
      const parseAppointment = Appointment.mapFromPrisma(
        ownerAppointment,
        ownerAppointment.pet
      );
      return parseAppointment;
    }

    return undefined;
  }
}
