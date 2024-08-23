import { PrismaClient } from '@prisma/client';
import { IAppointmentRepository } from '.';
import { Appointment } from '../../entities';
import { getExaminationEnum } from '../../../shared';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Appointment[] | undefined> {
    const appointments = await this.prisma.appointment.findMany({});

    if (!appointments) return undefined;

    const parseAppointments = appointments.map((appointment) => {
      return new Appointment(
        appointment.id,
        appointment.date,
        appointment.hour,
        appointment.status,
        appointment.examination,
        appointment.observations,
        appointment.vetID,
        appointment.petID,
        appointment.ownerID
      );
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
      return new Appointment(
        appointment.id,
        appointment.date,
        appointment.hour,
        appointment.status,
        appointment.examination,
        appointment.observations,
        appointment.vetID,
        appointment.petID,
        appointment.ownerID
      );
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

    const parseAppointment = new Appointment(
      appointment.id,
      appointment.date,
      appointment.hour,
      appointment.status,
      appointment.examination,
      appointment.observations,
      appointment.vetID,
      appointment.petID,
      appointment.ownerID
    );

    return parseAppointment;
  }

  public async save(appointment: Appointment): Promise<Appointment> {
    const createdAppointment = await this.prisma.appointment.create({
      data: {
        date: appointment.date,
        hour: appointment.hour,
        status: appointment.status,
        examination: getExaminationEnum(appointment.examination),
        observations: appointment.observations,
        vetID: appointment.vetID,
        petID: appointment.petID,
        ownerID: appointment.ownerID,
      },
    });

    const parseAppointment = new Appointment(
      createdAppointment.id,
      createdAppointment.date,
      createdAppointment.hour,
      createdAppointment.status,
      createdAppointment.examination,
      createdAppointment.observations,
      createdAppointment.vetID,
      createdAppointment.petID,
      createdAppointment.ownerID
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
        status: appointment.status,
        examination: getExaminationEnum(appointment.examination),
        observations: appointment.observations,
        vetID: appointment.vetID,
        petID: appointment.petID,
        ownerID: appointment.ownerID,
      },
    });

    const parseAppointment = new Appointment(
      updatedAppointment.id,
      updatedAppointment.date,
      updatedAppointment.hour,
      updatedAppointment.status,
      updatedAppointment.examination,
      updatedAppointment.observations,
      updatedAppointment.vetID,
      updatedAppointment.petID,
      updatedAppointment.ownerID
    );

    return parseAppointment;
  }

  public async updateStatus(id: string, status: boolean): Promise<Appointment> {
    const updatedAppointment = await this.prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    const parseAppointment = new Appointment(
      updatedAppointment.id,
      updatedAppointment.date,
      updatedAppointment.hour,
      updatedAppointment.status,
      updatedAppointment.examination,
      updatedAppointment.observations,
      updatedAppointment.vetID,
      updatedAppointment.petID,
      updatedAppointment.ownerID
    );

    return parseAppointment;
  }

  public async delete(id: string): Promise<Appointment> {
    const appointment = await this.prisma.appointment.delete({
      where: {
        id: id,
      },
    });

    const parseAppointment = new Appointment(
      appointment.id,
      appointment.date,
      appointment.hour,
      appointment.status,
      appointment.examination,
      appointment.observations,
      appointment.vetID,
      appointment.petID,
      appointment.ownerID
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
    });

    const ownerAppointment = await this.prisma.appointment.findFirst({
      where: { ownerID: ownerID, date: date, hour: hour },
    });

    if (vetAppointment) {
      const parseAppointment = new Appointment(
        vetAppointment.id,
        vetAppointment.date,
        vetAppointment.hour,
        vetAppointment.status,
        vetAppointment.examination,
        vetAppointment.observations,
        vetAppointment.vetID,
        vetAppointment.petID,
        vetAppointment.ownerID
      );
      return parseAppointment;
    } else if (ownerAppointment) {
      const parseAppointment = new Appointment(
        ownerAppointment.id,
        ownerAppointment.date,
        ownerAppointment.hour,
        ownerAppointment.status,
        ownerAppointment.examination,
        ownerAppointment.observations,
        ownerAppointment.vetID,
        ownerAppointment.petID,
        ownerAppointment.ownerID
      );
      return parseAppointment;
    } else return undefined;
  }
}
