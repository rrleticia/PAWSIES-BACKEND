import { OwnerRepository } from './interfaces';
import { Owner } from './models/index';

export class OwnerService {
  constructor(private readonly repository: OwnerRepository) {}

  public async getAll(): Promise<Owner[]> {
    return await this.repository.findAll();
  }

  public async getOneByID(id: string): Promise<Owner | undefined> {
    return await this.repository.findOneByID(id);
  }

  public async create(owner: Owner): Promise<Owner> {
    return await this.repository.save(owner);
  }

  public async update(owner: Owner): Promise<Owner> {
    return await this.repository.save(owner);
  }

  public async delete(id: string): Promise<Owner> {
    return await this.repository.delete(id);
  }
}
