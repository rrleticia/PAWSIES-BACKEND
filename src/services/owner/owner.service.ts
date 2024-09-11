import {
  OwnerNotFoundError,
  OwnerAlreadyExistsError,
  UserAlreadyExistsError,
} from '../../errors';
import {
  IOwnerRepository,
  IUserRepository,
  Owner,
  OwnerRequest,
  User,
} from '../../infra';
import { UnknownError } from '../../shared';

export class OwnerService {
  constructor(
    private readonly repository: IOwnerRepository,
    private readonly userRepository: IUserRepository
  ) {}

  public async getAll(): Promise<Owner[] | undefined> {
    try {
      const result = await this.repository.findAll();
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

  public async create(owner: OwnerRequest): Promise<Owner> {
    try {
      const userValidation = await this.userRepository.findOneByEmailOrUsername(
        owner.email,
        owner.username
      );

      if (userValidation && (userValidation.ownerID || userValidation.vetID))
        throw new UserAlreadyExistsError(
          'The user already exists in the database.',
          409
        );

      const validation = await this.repository.findOneByName(owner.name);
      if (validation)
        throw new OwnerAlreadyExistsError(
          'The owner already exists in the database.',
          409
        );

      const result = await this.repository.save(owner);

      if (!result) throw new UnknownError('Internal Server Error.', 500);

      return result;
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw error;
      }
      if (error instanceof OwnerAlreadyExistsError) {
        throw error;
      }
      if (error instanceof OwnerNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async update(owner: Owner): Promise<Owner> {
    try {
      const validation = await this.repository.findOneByID(owner.id);
      if (!validation)
        throw new OwnerNotFoundError(
          'The owner could not be found in the database.',
          404
        );
      const result = await this.repository.update(owner.id, owner);
      return result;
    } catch (error) {
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
}
