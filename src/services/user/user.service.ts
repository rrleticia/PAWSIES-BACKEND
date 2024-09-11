import {
  UserNotFoundError,
  UserAlreadyExistsError,
  UserPasswordFieldError,
} from '../../errors';
import { IUserRepository, User } from '../../infra';
import { UnknownError } from '../../shared';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  public async getAll(): Promise<User[] | undefined> {
    try {
      let result = await this.repository.findAll();
      if (!result) throw new UnknownError('Internal Server Error.', 500);
      result.map((r) => delete r.password);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getOneByID(id: string): Promise<User> {
    try {
      let result = await this.repository.findOneByID(id);
      if (!result)
        throw new UserNotFoundError(
          'The user could not be found in the database.',
          404
        );
      delete result.password;

      return result;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      } else throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async create(user: User): Promise<User> {
    try {
      const password = user.password;
      if (!password)
        throw new UserPasswordFieldError(
          'Invalid input for password field of User.',
          405
        );
      const hashedPassword = await bcrypt.hash(password, 11);
      user.password = hashedPassword;

      const validation = await this.repository.findOneByEmailOrUsername(
        user.email,
        user.username
      );

      if (validation)
        throw new UserAlreadyExistsError(
          'The user already exists in the database.',
          409
        );

      let result = await this.repository.save(user);

      if (!result)
        throw new UserPasswordFieldError(
          'Internal Server Error. Ensure password is valid.',
          500
        );

      delete result.password;

      return result;
    } catch (error) {
      if (error instanceof UserPasswordFieldError) {
        throw error;
      }
      if (error instanceof UserAlreadyExistsError) {
        throw error;
      }
      if (error instanceof UnknownError) {
        throw error;
      } else throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async update(user: User): Promise<User> {
    try {
      const validation = await this.repository.findOneByID(user.id);
      if (!validation)
        throw new UserNotFoundError(
          'The user could not be found in the database.',
          404
        );
      const result = await this.repository.update(user.id, user);

      delete result.password;

      return result;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      } else throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async delete(id: string): Promise<User> {
    try {
      const validation = await this.repository.findOneByID(id);
      if (!validation) {
        throw new UserNotFoundError(
          'The user could not be found in the database.',
          404
        );
      }
      const result = await this.repository.delete(id);

      delete result.password;

      return result;
    } catch (error: any) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }
}
