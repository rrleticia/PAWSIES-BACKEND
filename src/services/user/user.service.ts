import { UserNotFoundError, UserAlreadyExistsError } from '../../errors';
import { IUserRepository, User } from '../../infra';
import { UnknownError } from '../../shared';
import bcrypt from 'bcrypt';

export class UserService {
  constructor(private readonly repository: IUserRepository) {}

  public async getAll(): Promise<User[]> {
    try {
      const result = await this.repository.findAll();
      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getOneByID(id: string): Promise<User> {
    try {
      const result = await this.repository.findOneByID(id);
      if (!result)
        throw new UserNotFoundError(
          'The user could not be found in the database.',
          404
        );
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async create(user: User): Promise<User> {
    try {
      const password = user.password;
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
      const result = await this.repository.save(user);
      console.log(result);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
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
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
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
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }
}
