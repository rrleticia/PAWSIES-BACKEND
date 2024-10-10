import {
  OwnerNotFoundError,
  OwnerAlreadyExistsError,
  UserAlreadyExistsError,
  UserPasswordFieldError,
  VetAlreadyExistsError,
  OwnerValidationError,
} from '../../errors';
import { IOwnerRepository, IUserRepository, Owner } from '../../infra';
import { UnknownError } from '../../shared';
import bcrypt from 'bcrypt';
import { schemaOwnerValidation } from '../validation';

export class OwnerService {
  constructor(
    private readonly repository: IOwnerRepository,
    private readonly userRepository: IUserRepository
  ) {}

  public async getAll(): Promise<Owner[] | undefined> {
    try {
      let result = await this.repository.findAll();
      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getOneByID(id: string): Promise<Owner> {
    try {
      const result = await this.repository.findOneByID(id);
      if (!result)
        throw new OwnerNotFoundError(
          'The owner could not be found in the database.',
          404
        );
      return result;
    } catch (error) {
      if (error instanceof OwnerNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async create(data: any): Promise<Owner> {
    try {
      let owner = await schemaOwnerValidation(data);

      owner = await this._hashPassword(owner);

      await this._checkValidation(owner.email, owner.username);

      const result = await this.repository.save(owner);

      if (!result) throw new UnknownError('Internal Server Error.', 500);

      return result;
    } catch (error) {
      if (error instanceof OwnerValidationError) {
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
      if (error instanceof OwnerNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async update(data: any): Promise<Owner> {
    try {
      let owner = await schemaOwnerValidation(data);

      const validation = await this.repository.findOneByID(owner.id);

      if (!validation)
        throw new OwnerNotFoundError(
          'The owner could not be found in the database.',
          404
        );

      if (owner.password) owner = await this._hashPassword(owner);

      const result = await this.repository.update(owner.id, owner);

      return result;
    } catch (error) {
      if (error instanceof OwnerValidationError) {
        throw error;
      }
      if (error instanceof UserPasswordFieldError) {
        throw error;
      }
      if (error instanceof OwnerNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async delete(id: string): Promise<Owner> {
    try {
      const validation = await this.repository.findOneByID(id);

      if (!validation)
        throw new OwnerNotFoundError(
          'The owner could not be found in the database.',
          404
        );

      const result = await this.repository.delete(id);

      return result;
    } catch (error) {
      if (error instanceof OwnerNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  private async _hashPassword(owner: Owner): Promise<Owner> {
    const password = owner.password;
    if (!password)
      throw new UserPasswordFieldError(
        'Invalid input for password field of Owner.',
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
