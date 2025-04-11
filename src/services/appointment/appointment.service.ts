import {
  AppointmentNotFoundError,
  AppointmentAlreadyExistsError,
  AppointmentStatusFieldError,
  AppointmentValidationError,
  VetNotFoundError,
  OwnerNotFoundError,
  PetNotFoundError,
} from '../../errors';
import {
  IAppointmentRepository,
  Appointment,
  IOwnerRepository,
  IPetRepository,
  IVetRepository,
} from '../../infra';
import { UnknownError, validateDate } from '../../shared';

export class AppointmentService {
  constructor(
    private readonly repository: IAppointmentRepository,
    private readonly ownerRepository: IOwnerRepository,
    private readonly vetRepository: IVetRepository,
    private readonly petRepository: IPetRepository
  ) {}

  public async getAll(): Promise<Appointment[] | undefined> {
    try {
      const result = await this.repository.findAll();
      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getAllByPetName(
    name: string
  ): Promise<Appointment[] | undefined> {
    try {
      const result = await this.repository.findAllByPetName(name);
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

  public async create(appointment: any): Promise<Appointment> {
    try {
      this._checkDate(appointment.date);

      await this._checkOwner(appointment.ownerID);

      await this._checkVet(appointment.vetID);

      await this._checkPet(appointment.petID);

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
      if (error instanceof OwnerNotFoundError) {
        throw error;
      }
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      if (error instanceof PetNotFoundError) {
        throw error;
      }

      if (error instanceof AppointmentAlreadyExistsError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async update(appointment: any): Promise<Appointment> {
    try {
      this._checkDate(appointment.date);

      const validation = await this.repository.findOneByID(appointment.id);
      if (!validation)
        throw new AppointmentNotFoundError(
          'The Appointment could not be found in the database.',
          404
        );

      await this._checkOwner(appointment.ownerID);
      await this._checkVet(appointment.vetID);
      await this._checkPet(appointment.petID);

      const result = await this.repository.update(appointment.id, appointment);

      return result;
    } catch (error) {
      if (error instanceof OwnerNotFoundError) {
        throw error;
      }
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      if (error instanceof PetNotFoundError) {
        throw error;
      }
      if (error instanceof AppointmentValidationError) {
        throw error;
      }
      if (error instanceof AppointmentNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async updateStatus(
    id: string,
    status: string | undefined
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

  private _checkDate(date: Date): void {
    const valid = validateDate(date);
    if (!valid)
      throw new AppointmentValidationError(
        'The date must not be older than the current date.',
        405
      );
  }

  private async _checkOwner(id: string): Promise<void> {
    const owner = await this.ownerRepository.existsOwnerID(id);
    if (!owner)
      throw new OwnerNotFoundError(
        'The owner provided for Appointment could not be found in the database.',
        404
      );
  }

  private async _checkVet(id: string): Promise<void> {
    const vet = await this.vetRepository.existsVetID(id);
    if (!vet)
      throw new VetNotFoundError(
        'The vet provided for Appointment could not be found in the database.',
        404
      );
  }

  private async _checkPet(id: string): Promise<void> {
    const pet = await this.petRepository.existsID(id);
    if (!pet)
      throw new PetNotFoundError(
        'The pet provided for Appointment could not be found in the database.',
        404
      );
  }
}
