import {
  PetNotFoundError,
  PetAlreadyExistsError,
  PetValidationError,
  OwnerNotFoundError,
} from '../../errors';
import { IOwnerRepository, IPetRepository, Pet } from '../../infra';
import { UnknownError } from '../../shared';
import { schemaPetValidation } from '../validation';

export class PetService {
  constructor(
    private readonly repository: IPetRepository,
    private readonly ownerRepostiory: IOwnerRepository
  ) {}

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
      if (error instanceof PetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async create(data: any): Promise<Pet> {
    try {
      let pet = await schemaPetValidation(data);

      await this._checkOwner(pet.ownerID);

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
      if (error instanceof OwnerNotFoundError) {
        throw error;
      }
      if (error instanceof PetValidationError) {
        throw error;
      }
      if (error instanceof PetAlreadyExistsError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async update(data: any): Promise<Pet> {
    try {
      let pet = await schemaPetValidation(data);

      const validation = await this.repository.findOneByID(pet.id);

      if (!validation)
        throw new PetNotFoundError(
          'The pet could not be found in the database.',
          404
        );
      await this._checkOwner(pet.ownerID);

      const result = await this.repository.update(pet.id, pet);

      return result;
    } catch (error) {
      if (error instanceof OwnerNotFoundError) {
        throw error;
      }
      if (error instanceof PetValidationError) {
        throw error;
      }
      if (error instanceof PetNotFoundError) {
        throw error;
      }
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
      if (error instanceof PetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  private async _checkOwner(id: string): Promise<void> {
    const owner = await this.ownerRepostiory.findOneByID(id);
    if (!owner)
      throw new OwnerNotFoundError(
        'The owner provided for Pet could not be found in the database.',
        404
      );
  }
}
