import { PetNotFoundError, PetAlreadyExistsError } from '../../errors';
import { IPetRepository, Pet } from '../../infra';
import { UnknownError } from '../../shared';

export class PetService {
  constructor(private readonly repository: IPetRepository) {}

  public async getAll(): Promise<Pet[] | undefined> {
    try {
      const result = await this.repository.findAll();
      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getAllByOwnerID(ownerID: string): Promise<Pet[] | undefined> {
    try {
      const result = await this.repository.findAllByOwnerID(ownerID);
      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getOneByID(id: string): Promise<Pet> {
    try {
      const result = await this.repository.findOneByID(id);
      if (!result)
        throw new PetNotFoundError(
          'The pet could not be found in the database.',
          404
        );
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async create(pet: Pet): Promise<Pet> {
    try {
      const validation = await this.repository.findOneByOwnerWithNameAndType(
        pet.ownerID,
        pet.name,
        pet.type
      );
      if (validation)
        throw new PetAlreadyExistsError(
          'The pet already exists in the database.',
          409
        );
      const result = await this.repository.save(pet);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async update(pet: Pet): Promise<Pet> {
    try {
      const validation = await this.repository.findOneByID(pet.id);
      if (!validation)
        throw new PetNotFoundError(
          'The pet could not be found in the database.',
          404
        );
      const result = await this.repository.save(pet);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async delete(id: string): Promise<Pet> {
    try {
      const validation = await this.repository.findOneByID(id);
      if (!validation)
        throw new PetNotFoundError(
          'The pet could not be found in the database.',
          404
        );
      const result = await this.repository.delete(id);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }
}
