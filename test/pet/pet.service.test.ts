import { PetType, Role } from '@prisma/client';
import { PetNotFoundError } from '../../src/errors';
import { PrismaPetRepository } from '../../src/infra';
import { PetService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('pet.service', () => {
  let repository: PrismaPetRepository;
  let service: PetService;

  beforeAll(() => {
    repository = new PrismaPetRepository(prisma);
    service = new PetService(repository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('[GET ALL] empty list of pets', () => {
    it('should return a list of pets', async () => {
      prisma.pet.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ONE] pet by :id', () => {
    it('should return a pet by id', async () => {
      const id = '12345678';
      const ownerID = '091327246';

      const getPet = {
        id: id,
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      prisma.pet.findUnique.mockResolvedValueOnce(getPet);

      const pet = await service.getOneByID(id);

      expect(pet).toEqual(getPet);
    });
  });

  describe('[POST] new valid pet', () => {
    it('should create and return a pet', async () => {
      const id = '12345678';
      const ownerID = '091327246';

      const createdPet = {
        id: id,
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      prisma.pet.findUnique.mockResolvedValueOnce(null);

      prisma.pet.create.mockResolvedValueOnce(createdPet);

      const pet = await service.create(createdPet);

      expect(pet).toEqual(createdPet);
    });
  });

  describe('[PUT] update pet that exists', () => {
    it('should update and return the pet', async () => {
      const id = '12345678';
      const ownerID = '091327246';

      const updatedpet = {
        id: id,
        name: 'pet',
        breed: 'breed',
        color: 'color',
        age: 12,
        weight: 12,
        type: 'CAT' as PetType,
        ownerID: ownerID,
      };

      prisma.pet.findUnique.mockResolvedValueOnce(updatedpet);

      prisma.pet.update.mockResolvedValueOnce(updatedpet);

      const result = await service.update(updatedpet);

      expect(result).toEqual(updatedpet);
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
