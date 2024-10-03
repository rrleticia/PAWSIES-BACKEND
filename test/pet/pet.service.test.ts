import { PetType, Role } from '@prisma/client';
import {
  OwnerNotFoundError,
  PetAlreadyExistsError,
  PetNotFoundError,
  PetValidationError,
} from '../../src/errors';
import {
  IOwnerRepository,
  IPetRepository,
  PrismaOwnerRepository,
  PrismaPetRepository,
} from '../../src/infra';
import { PetService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('pet.service', () => {
  let repository: IPetRepository;
  let ownerRepository: IOwnerRepository;
  let service: PetService;

  const ownerID = '091327246';
  const createdAt = new Date();
  const updatedAt = new Date();

  beforeAll(() => {
    repository = new PrismaPetRepository(prisma);
    ownerRepository = new PrismaOwnerRepository(prisma);
    service = new PetService(repository, ownerRepository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    prisma.user.findUnique.mockResolvedValueOnce({
      id: '12345678',
      role: 'OWNER' as Role,
      email: 'rhaenyra@gmail.com',
      name: 'rhaenyra',
      username: 'rhaenyra',
      password: 'Caraxys123!',
      ownerID: '091327246',
      vetID: null,
      createdAt: createdAt,
      updatedAt: updatedAt,
    });
  });

  describe('[GET ALL] empty list of pets', () => {
    it('should return a list of pets', async () => {
      prisma.pet.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ALL] list of pets', () => {
    it('should return a list of pets', async () => {
      const petsList = [
        {
          id: '1',
          name: 'pet',
          breed: 'breed',
          color: 'color',
          age: 12,
          weight: 12,
          type: 'CAT' as PetType,
          ownerID: ownerID,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
        {
          id: '2',
          name: 'pet',
          breed: 'breed',
          color: 'color',
          age: 12,
          weight: 12,
          type: 'CAT' as PetType,
          ownerID: ownerID,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ];

      prisma.pet.findMany.mockResolvedValueOnce(petsList);

      const result = await service.getAll();

      expect(result).toEqual([
        {
          id: '1',
          name: 'pet',
          breed: 'breed',
          color: 'color',
          age: 12,
          weight: 12,
          type: 'CAT' as PetType,
          ownerID: ownerID,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
        {
          id: '2',
          name: 'pet',
          breed: 'breed',
          color: 'color',
          age: 12,
          weight: 12,
          type: 'CAT' as PetType,
          ownerID: ownerID,
          createdAt: createdAt,
          updatedAt: updatedAt,
        },
      ]);
    });
  });

  describe('[GET ONE] pet by :id', () => {
    it('should return a pet by id', async () => {
      const id = '12345678';

      const getPet = {
        id: id,
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      prisma.pet.findUnique.mockResolvedValueOnce(getPet);

      const pet = await service.getOneByID(id);

      expect(pet).toEqual(getPet);
    });
  });

  describe('[GET ONE] pet by :id', () => {
    it('should throw PetNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.pet.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOneByID(id)).rejects.toThrow(PetNotFoundError);
    });
  });

  describe('[CREATE] new valid pet', () => {
    it('should create and return a pet', async () => {
      const id = '12345678';

      const createdPet = {
        id: id,
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      prisma.pet.findUnique.mockResolvedValueOnce(null);

      prisma.pet.create.mockResolvedValueOnce(createdPet);

      const pet = await service.create({
        id: id,
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      });

      expect(pet).toEqual(createdPet);
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it('should throw PetAlreadyExistsError', async () => {
      const existingPet = {
        id: '1',
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      prisma.pet.findFirst.mockResolvedValueOnce(existingPet);

      await expect(
        service.create({
          id: '1',
          name: 'pet',
          breed: 'breed',
          color: 'color',
          age: 12,
          weight: 12,
          type: 'CAT' as PetType,
          ownerID: ownerID,
        })
      ).rejects.toThrow(PetAlreadyExistsError);
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it('empty name: should throw PetValidationError', async () => {
      const createdPet = {
        id: '1',
        name: '',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      await expect(service.create(createdPet)).rejects.toThrow(
        PetValidationError
      );
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it('blank name: should throw PetValidationError', async () => {
      const createdPet = {
        id: '1',
        name: '    ',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      await expect(service.create(createdPet)).rejects.toThrow(
        PetValidationError
      );
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it(' empty breed: should throw PetValidationError', async () => {
      const createdPet = {
        id: '1',
        name: 'pet name',
        breed: '',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      await expect(service.create(createdPet)).rejects.toThrow(
        PetValidationError
      );
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it('blank breed: should throw PetValidationError', async () => {
      const createdPet = {
        id: '1',
        name: 'pet name',
        breed: '    ',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      await expect(service.create(createdPet)).rejects.toThrow(
        PetValidationError
      );
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it(' empty color: should throw PetValidationError', async () => {
      const createdPet = {
        id: '1',
        name: 'pet name',
        breed: 'breed',
        color: '',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      await expect(service.create(createdPet)).rejects.toThrow(
        PetValidationError
      );
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it('blank color: should throw PetValidationError', async () => {
      const createdPet = {
        id: '1',
        name: 'pet name',
        breed: 'breed',
        color: '     ',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      await expect(service.create(createdPet)).rejects.toThrow(
        PetValidationError
      );
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it('invalid type: should throw PetValidationError for', async () => {
      const createdPet = {
        id: '1',
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'INVALID' as PetType,
        ownerID: ownerID,
      };

      await expect(service.create(createdPet)).rejects.toThrow(
        PetValidationError
      );
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it('should throw PetValidationError for invalid age', async () => {
      const createdPet = {
        id: '1',
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: -1,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      await expect(service.create(createdPet)).rejects.toThrow(
        PetValidationError
      );
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it('should throw PetValidationError for invalid weight', async () => {
      const createdPet = {
        id: '1',
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: -5,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      await expect(service.create(createdPet)).rejects.toThrow(
        PetValidationError
      );
    });
  });

  describe('[CREATE] new invalid pet', () => {
    it('ownerID invalid: should throw OwnerNotFoundError', async () => {
      const createdPet = {
        id: '1',
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: '4',
      };

      vi.restoreAllMocks();
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.create(createdPet)).rejects.toThrow(
        OwnerNotFoundError
      );
    });
  });

  describe('[UPDATE] update pet that exists', () => {
    it('should update and return the pet', async () => {
      const id = '12345678';

      const updatedpet = {
        id: id,
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      prisma.pet.findUnique.mockResolvedValueOnce(updatedpet);

      prisma.pet.update.mockResolvedValueOnce(updatedpet);

      const result = await service.update({
        id: id,
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      });

      expect(result).toEqual(updatedpet);
    });
  });

  describe('[UPDATE] update pet that does not exists', () => {
    it('should throw PetNotFoundError', async () => {
      const id = '12345678';

      prisma.pet.findUnique.mockResolvedValueOnce(null);

      expect(
        service.update({
          id: id,
          name: 'pet',
          breed: 'breed',
          color: 'color',
          age: 12,
          weight: 12,
          type: 'CAT' as PetType,
          ownerID: '091327246',
        })
      ).rejects.toThrow(PetNotFoundError);
    });
  });

  describe('[DELETE] delete pet that does exist', () => {
    it('should delete and return the pet', async () => {
      const id = '12345678';

      const deletedPet = {
        id: id,
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: '091327246',
        createdAt: createdAt,
        updatedAt: updatedAt,
      };

      prisma.pet.findUnique.mockResolvedValueOnce(deletedPet);

      prisma.pet.delete.mockResolvedValueOnce(deletedPet);

      const result = await service.delete(id);

      expect(result).toEqual(deletedPet);
    });
  });

  describe('[DELETE] delete pet that does not exist', () => {
    it('should throw PetNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.pet.findUnique.mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow(PetNotFoundError);
    });
  });
});
