import { VetNotFoundError, VetAlreadyExistsError } from '../../errors';
import { IVetRepository, Vet } from '../../infra';

export class VetService {
  constructor(private readonly repository: IVetRepository) {}

  public async getAll(): Promise<Vet[]> {
    return await this.repository.findAll();
  }

  public async getOneByID(id: string): Promise<Vet> {
    const result = await this.repository.findOneByID(id);
    if (!result)
      throw new VetNotFoundError(
        'The Vet could not be found in the database.',
        404
      );
    return result;
  }

  public async create(Vet: Vet): Promise<Vet> {
    const validation = await this.repository.findOneByEmailAndUsername(
      Vet.email,
      Vet.username
    );
    if (validation)
      throw new VetAlreadyExistsError(
        'The Vet already exists in the database.',
        409
      );
    const result = await this.repository.save(Vet);
    return result;
  }

  public async update(Vet: Vet): Promise<Vet> {
    const validation = await this.repository.findOneByID(Vet.id);
    if (!validation)
      throw new VetNotFoundError(
        'The Vet could not be found in the database.',
        404
      );
    const result = await this.repository.save(Vet);
    return result;
  }

  public async delete(id: string): Promise<Vet> {
    const validation = await this.repository.findOneByID(id);
    if (!validation)
      throw new VetNotFoundError(
        'The Vet could not be found in the database.',
        404
      );
    const result = await this.repository.delete(id);
    return result;
  }
}
