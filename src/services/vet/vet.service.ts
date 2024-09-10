import {
  VetNotFoundError,
  VetAlreadyExistsError,
  UserAlreadyExistsError,
} from '../../errors';
import { IUserRepository, IVetRepository, Vet, VetRequest } from '../../infra';
import { UnknownError } from '../../shared';

export class VetService {
  constructor(
    private readonly repository: IVetRepository,
    private readonly userRepository: IUserRepository
  ) {}

  public async getAll(): Promise<Vet[]> {
    try {
      const result = await this.repository.findAll();
      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async getOneByID(id: string): Promise<Vet> {
    try {
      const result = await this.repository.findOneByID(id);
      if (!result)
        throw new VetNotFoundError(
          'The vet could not be found in the database.',
          404
        );
      return result;
    } catch (error) {
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async create(vet: VetRequest): Promise<Vet> {
    try {
      const userValidation = await this.userRepository.findOneByEmailOrUsername(
        vet.email,
        vet.username
      );
      if (userValidation)
        throw new UserAlreadyExistsError(
          'The user already exists in the database.',
          409
        );

      const validation = await this.repository.findOneByName(vet.name);
      if (validation)
        throw new VetAlreadyExistsError(
          'The vet already exists in the database.',
          409
        );
      const result = await this.repository.save(vet);
      if (!result) throw new UnknownError('Internal Server Error.', 500);
      return result;
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        throw error;
      }
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async update(vet: Vet): Promise<Vet> {
    try {
      const validation = await this.repository.findOneByID(vet.id);
      if (!validation)
        throw new VetNotFoundError(
          'The vet could not be found in the database.',
          404
        );
      const result = await this.repository.update(vet.id, vet);
      return result;
    } catch (error) {
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }

  public async delete(id: string): Promise<Vet> {
    try {
      const validation = await this.repository.findOneByID(id);
      if (!validation)
        throw new VetNotFoundError(
          'The vet could not be found in the database.',
          404
        );
      const result = await this.repository.delete(id);
      return result;
    } catch (error) {
      if (error instanceof VetNotFoundError) {
        throw error;
      }
      throw new UnknownError('Internal Server Error.', 500);
    }
  }
}
