import { PrismaClient } from '@prisma/client';
import { IAppointmentRepository } from '.';
import { Appointment } from '../../entities';
import { getAppointmentStatusEnum, getExaminationEnum } from '../../../shared';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Appointment[] | undefined> {
    const appointments = await this.prisma.appointment.findMany({});

    if (!appointments) return undefined;

    const parseAppointments = appointments.map((appointment) => {
      return Appointment.mapFromPrisma(appointment);
    });

    return parseAppointments;
  }

  public async findAllByPetID(
    petID: string
  ): Promise<Appointment[] | undefined> {
    const appointments = await this.prisma.appointment.findMany({
      where: { petID: petID },
    });

    if (!appointments) return undefined;

    const parseAppointments = appointments.map((appointment) => {
      return Appointment.mapFromPrisma(appointment);
    });

    return parseAppointments;
  }

  public async findOneByID(id: string): Promise<Appointment | undefined> {
    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id: id,
      },
    });

    if (!appointment) return undefined;

    const parseAppointment = Appointment.mapFromPrisma(appointment);

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
    });

    const parseAppointment = Appointment.mapFromPrisma(createdAppointment);

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
    });

    const parseAppointment = Appointment.mapFromPrisma(updatedAppointment);

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
    });

    const parseAppointment = Appointment.mapFromPrisma(updatedAppointment);

    return parseAppointment;
  }

  public async delete(id: string): Promise<Appointment> {
    const appointment = await this.prisma.appointment.delete({
      where: {
        id: id,
      },
    });

    const parseAppointment = Appointment.mapFromPrisma(appointment);

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
    });

    const ownerAppointment = await this.prisma.appointment.findFirst({
      where: { ownerID: ownerID, date: date, hour: hour },
    });

    if (vetAppointment) {
      const parseAppointment = Appointment.mapFromPrisma(vetAppointment);
      return parseAppointment;
    } else if (ownerAppointment) {
      const parseAppointment = Appointment.mapFromPrisma(ownerAppointment);
      return parseAppointment;
    } else return undefined;
  }
}
