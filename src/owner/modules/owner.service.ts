import { OwnerAlreadyExistsError, OwnerNotFoundError } from '../error';
import { OwnerRepository } from '../interface';
import { Owner } from '../models/index';

export class OwnerService {
  constructor(private readonly repository: OwnerRepository) {}

  public async getAll(): Promise<Owner[]> {
    return await this.repository.findAll();
  }

  public async getOneByID(id: string): Promise<Owner> {
    const result = await this.repository.findOneByID(id);
    if (!result)
      throw new OwnerNotFoundError(
        'The owner could not be found in the database.',
        404
      );
    return result;
  }

  public async create(owner: Owner): Promise<Owner> {
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
  }

  public async update(owner: Owner): Promise<Owner> {
    const validation = await this.repository.findOneByID(owner.id);
    if (!validation)
      throw new OwnerNotFoundError(
        'The owner could not be found in the database.',
        404
      );
    const result = await this.repository.save(owner);
    return result;
  }

  public async delete(id: string): Promise<Owner> {
    const validation = await this.repository.findOneByID(id);
    if (!validation)
      throw new OwnerNotFoundError(
        'The owner could not be found in the database.',
        404
      );
    const result = await this.repository.delete(id);
    return result;
  }
}
