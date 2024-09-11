import {
  VetNotFoundError,
  VetAlreadyExistsError,
  UserAlreadyExistsError,
  OwnerAlreadyExistsError,
  UserPasswordFieldError,
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

  public async create(data: Vet): Promise<Vet> {
    try {
      let vet = await this._hashPassword(data);

      this._checkValidation(vet.email, vet.username);

      const result = await this.repository.save(vet);

      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
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

  public async update(data: Vet): Promise<Vet> {
    try {
      const validation = await this.repository.findOneByID(data.id);
      if (!validation)
        throw new VetNotFoundError(
          'The vet could not be found in the database.',
          404
        );
      let vet = data;
      if (data.password) vet = await this._hashPassword(data);
      const result = await this.repository.update(vet.id, vet);
      return result;
    } catch (error) {
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

  private async _hashPassword(owner: Vet): Promise<Vet> {
    const password = owner.password;
    if (!password)
      throw new UserPasswordFieldError(
        'Invalid input for password field of Vet.',
        405
      );

    const hashedPassword = await bcrypt.hash(password, 11);
    owner.password = hashedPassword;
    return owner;
  }

  private async _checkValidation(
    email: string,
    username: string
  ): Promise<void> {
    const user = await this.userRepository.findOneByEmailOrUsername(
      email,
      username
    );
    if (user && (user.ownerID || user.vetID)) {
      if (user.ownerID) {
        throw new OwnerAlreadyExistsError(
          'The user already exists in the database. The user is connected to an owner already.',
          409
        );
      } else if (user.ownerID) {
        throw new VetAlreadyExistsError(
          'The user already exists in the database. The user is connected to a vet already.',
          409
        );
      }
      throw new UserAlreadyExistsError(
        'The user already exists in the database. ',
        409
      );
    }
  }
}
