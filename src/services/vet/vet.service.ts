import {
  VetNotFoundError,
  VetAlreadyExistsError,
  UserAlreadyExistsError,
  OwnerAlreadyExistsError,
  UserPasswordFieldError,
  VetValidationError,
} from '../../errors';
import { IUserRepository, IVetRepository, Vet } from '../../infra';
import { UnknownError } from '../../shared';
import bcrypt from 'bcrypt';

export class VetService {
  constructor(
    private readonly repository: IVetRepository,
    private readonly userRepository: IUserRepository
  ) {}

  public async getAll(): Promise<Vet[]> {
    try {
      const result = await this.repository.findAll();

      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getOneByID(id: string): Promise<Vet> {
    try {
      const result = await this.repository.findOneByID(id);
      if (!result)
        throw new VetNotFoundError(
          'The vet could not be found in the database.',
          404
        );
      return result;
    } catch (error) {
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async create(vet: any): Promise<Vet> {
    try {
      vet = await this._hashPassword(vet);

      await this._checkValidation(vet.email, vet.username);

      const result = await this.repository.save(vet);

      if (!result) throw new UnknownError('Internal Server Error.', 500);

      return result;
    } catch (error) {
      if (error instanceof VetValidationError) {
        throw error;
      }
      if (error instanceof UserPasswordFieldError) {
        throw error;
      }
      if (error instanceof OwnerAlreadyExistsError) {
        throw error;
      }
      if (error instanceof VetAlreadyExistsError) {
        throw error;
      }
      if (error instanceof UserAlreadyExistsError) {
        throw error;
      }
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async update(vet: any): Promise<Vet> {
    try {
      const validation = await this.repository.findOneByID(vet.id);

      if (!validation)
        throw new VetNotFoundError(
          'The vet could not be found in the database.',
          404
        );

      if (vet.password) vet = await this._hashPassword(vet);

      const result = await this.repository.update(vet.id, vet);

      return result;
    } catch (error) {
      if (error instanceof VetValidationError) {
        throw error;
      }
      if (error instanceof UserPasswordFieldError) {
        throw error;
      }
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async delete(id: string): Promise<Vet> {
    try {
      const validation = await this.repository.findOneByID(id);
      if (!validation)
        throw new VetNotFoundError(
          'The vet could not be found in the database.',
          404
        );
      const result = await this.repository.delete(id);
      return result;
    } catch (error) {
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  private async _hashPassword(vet: Vet): Promise<Vet> {
    const password = vet.password;
    if (!password)
      throw new UserPasswordFieldError(
        'Invalid input for password field of Vet.',
        405
      );

    const hashedPassword = await bcrypt.hash(password, 11);
    vet.password = hashedPassword;
    return vet;
  }

  private async _checkValidation(
    email: string,
    username: string
  ): Promise<void> {
    const user = await this.userRepository.findOneByEmailOrUsername(
      email,
      username
    );
    if (user && user.ownerID)
      throw new OwnerAlreadyExistsError(
        'The user already exists in the database. The user is connected to an owner already.',
        409
      );
    if (user && user.vetID)
      throw new VetAlreadyExistsError(
        'The user already exists in the database. The user is connected to a vet already.',
        409
      );
    if (user)
      throw new UserAlreadyExistsError(
        'The user already exists in the database. ',
        409
      );
  }
}
