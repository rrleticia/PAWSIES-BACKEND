import { Role, Specialty } from '@prisma/client';
import { VetNotFoundError } from '../../src/errors';
import { PrismaVetRepository, PrismaUserRepository } from '../../src/infra';
import { VetService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('vet.service', () => {
  let userRepository: PrismaUserRepository;
  let repository: PrismaVetRepository;
  let service: VetService;

  beforeAll(() => {
    userRepository = new PrismaUserRepository(prisma);
    repository = new PrismaVetRepository(prisma);
    service = new VetService(repository, userRepository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('[GET ALL] empty list of vets', () => {
    it('should return a list of vets', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ONE] vet by :id', () => {
    it('should return a vet by id', async () => {
      const id = '12345678';
      const vetID = '987654321';

      const getvet = {
        id: id,
        name: 'daenerys',
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'caraxys123!',
        ownerID: null,
        vetID: vetID,
        vet: {
          id: vetID,
          specialty: 'CAT_DOG' as Specialty,
        },
      };

      prisma.user.findUnique.mockResolvedValueOnce(getvet);

      const vet = await service.getOneByID(id);

      expect(vet).toEqual({
        id: id,
        name: 'daenerys',
        specialty: 'CAT_DOG' as Specialty,
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        vetID: vetID,
      });
    });
  });

  describe('[POST] new valid vet', () => {
    it('should create and return a vet', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const createdvet = {
        id: id,
        name: 'daenerys',
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'caraxys123!',
        ownerID: null,
        vetID: vetID,
        vet: {
          id: vetID,
          specialty: 'CAT_DOG' as Specialty,
        },
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      prisma.user.create.mockResolvedValueOnce(createdvet);

      const vet = await service.create({
        id: id,
        name: 'daenerys',
        specialty: 'CAT_DOG' as Specialty,
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'caraxys123!',
      });

      expect(vet).toEqual({
        id: id,
        name: 'daenerys',
        specialty: 'CAT_DOG' as Specialty,
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        vetID: vetID,
      });
    });
  });

  describe('[PUT] update vet that exists', () => {
    it('should update and return the vet', async () => {
      const id = '12345678';
      const vetID = '987654321';

      const updatedvet = {
        id: id,
        name: 'daenerys',
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'caraxys123!',
        ownerID: null,
        vetID: vetID,
        vet: {
          id: vetID,
          specialty: 'CAT_DOG' as Specialty,
        },
      };
      prisma.user.findUnique.mockResolvedValueOnce(updatedvet);

      prisma.user.update.mockResolvedValueOnce(updatedvet);

      const result = await service.update({
        id: id,
        name: 'daenerys',
        specialty: 'CAT_DOG' as Specialty,
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'caraxys123!',
      });

      expect(result).toEqual({
        id: id,
        name: 'daenerys',
        specialty: 'CAT_DOG' as Specialty,
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        vetID: vetID,
      });
    });
  });

  describe('[DELETE] delete vet that does not exist', () => {
    it('should throw VetNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.vet.findUnique.mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow(VetNotFoundError);
    });
  });
});
