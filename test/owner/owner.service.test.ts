import { Role } from '@prisma/client';
import { OwnerNotFoundError } from '../../src/errors';
import { PrismaOwnerRepository, PrismaUserRepository } from '../../src/infra';
import { OwnerService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('owner.service', () => {
  let userRepository: PrismaUserRepository;
  let repository: PrismaOwnerRepository;
  let service: OwnerService;

  beforeAll(() => {
    userRepository = new PrismaUserRepository(prisma);
    repository = new PrismaOwnerRepository(prisma);
    service = new OwnerService(repository, userRepository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('[GET ALL] empty list of owners', () => {
    it('should return a list of owners', async () => {
      prisma.owner.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ONE] Owner by :id', () => {
    it('should return a owner by id', async () => {
      const id = '12345678';
      const getOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'daenerys@gmail.com',
        name: 'daenerys',
      };

      prisma.owner.findUnique.mockResolvedValueOnce(getOwner);

      const owner = await service.getOneByID(id);

      expect(owner).toEqual({
        id: '12345678',
        name: 'daenerys',
      });
    });
  });

  describe('[POST] new valid owner', () => {
    it('should create and return a owner', async () => {
      const id = '98765431';

      const createdOwner = {
        id: id,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'caraxys123!',
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      prisma.owner.findUnique.mockResolvedValueOnce(null);

      prisma.owner.create.mockResolvedValueOnce(createdOwner);

      const owner = await service.create(createdOwner);

      expect(owner).toEqual({
        id: id,
        name: 'rhaenyra',
      });
    });
  });

  describe('[PUT] update Owner that exists', () => {
    it('should update and return the Owner', async () => {
      const id = '12345678';

      const updatedOwner = {
        id: id,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'caraxys123!',
      };

      prisma.owner.findUnique.mockResolvedValueOnce(updatedOwner);

      prisma.owner.update.mockResolvedValueOnce(updatedOwner);

      const result = await service.update(updatedOwner);

      expect(result).toEqual({
        id: id,
        name: 'rhaenyra',
      });
    });
  });

  describe('[DELETE] delete Owner that does not exist', () => {
    it('should throw OwnerNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.owner.findUnique.mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow(OwnerNotFoundError);
    });
  });
});
