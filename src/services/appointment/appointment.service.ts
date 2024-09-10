import {
  AppointmentNotFoundError,
  AppointmentAlreadyExistsError,
  AppointmentStatusFieldError,
} from '../../errors';
import { IAppointmentRepository, Appointment } from '../../infra';
import { UnknownError } from '../../shared';

export class AppointmentService {
  constructor(private readonly repository: IAppointmentRepository) {}

  public async getAll(): Promise<Appointment[] | undefined> {
    try {
      const result = await this.repository.findAll();
      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getAllByPetID(
    petID: string
  ): Promise<Appointment[] | undefined> {
    try {
      const result = await this.repository.findAllByPetID(petID);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getOneByID(id: string): Promise<Appointment> {
    try {
      const result = await this.repository.findOneByID(id);
      if (!result)
        throw new AppointmentNotFoundError(
          'The Appointment could not be found in the database.',
          404
        );
      return result;
    } catch (error) {
      if (error instanceof AppointmentNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async create(appointment: Appointment): Promise<Appointment> {
    try {
      const validation =
        await this.repository.findAnyByVetAndOwnerWithDateAndHour(
          appointment.vetID,
          appointment.ownerID,
          appointment.date,
          appointment.hour
        );
      if (validation)
        throw new AppointmentAlreadyExistsError(
          'The Appointment already exists in the database.',
          409
        );
      const result = await this.repository.save(appointment);
      return result;
    } catch (error) {
      if (error instanceof AppointmentAlreadyExistsError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async update(appointment: Appointment): Promise<Appointment> {
    try {
      const validation = await this.repository.findOneByID(appointment.id);
      if (!validation)
        throw new AppointmentNotFoundError(
          'The Appointment could not be found in the database.',
          404
        );
      const result = await this.repository.update(appointment.id, appointment);
      return result;
    } catch (error) {
      if (error instanceof AppointmentNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async updateStatus(
    id: string,
    status: boolean | undefined
  ): Promise<Appointment> {
    try {
      const validation = await this.repository.findOneByID(id);
      if (!status)
        throw new AppointmentStatusFieldError(
          'Invalid input for status field of Appointment.',
          405
        );
      if (!validation)
        throw new AppointmentNotFoundError(
          'The Appointment could not be found in the database.',
          404
        );
      const result = await this.repository.updateStatus(id, status);
      return result;
    } catch (error) {
      if (error instanceof AppointmentStatusFieldError) {
        throw error;
      }
      if (error instanceof AppointmentNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async delete(id: string): Promise<Appointment> {
    try {
      const validation = await this.repository.findOneByID(id);
      if (!validation)
        throw new AppointmentNotFoundError(
          'The Appointment could not be found in the database.',
          404
        );
      const result = await this.repository.delete(id);
      return result;
    } catch (error) {
      if (error instanceof AppointmentNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }
}
