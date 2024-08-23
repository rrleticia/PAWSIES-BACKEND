import { OwnerNotFoundError, OwnerAlreadyExistsError } from '../../errors';
import { IOwnerRepository, Owner } from '../../infra';
import { UnknownError } from '../../shared';

export class OwnerService {
  constructor(private readonly repository: IOwnerRepository) {}

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
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async create(owner: Owner): Promise<Owner> {
    try {
      const validation = await this.repository.findOneByEmailAndUsername(
        owner.email,
        owner.username
      );
      if (validation)
        throw new OwnerAlreadyExistsError(
          'The owner already exists in the database.',
          409
        );
      const result = await this.repository.save(owner);
      return result;
    } catch (error) {
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
      const result = await this.repository.save(owner);
      return result;
    } catch (error) {
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
      throw new UnknownError('Internal Server Error.', 500);
    }
  }
}
