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
      prisma.user.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ONE] owner by :id', () => {
    it('should return a owner by id', async () => {
      const id = '12345678';
      const ownerID = '987654321';

      const getOwner = {
        id: id,
        name: 'daenerys',
        role: 'OWNER' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(getOwner);

      const owner = await service.getOneByID(id);

      expect(owner).toEqual({
        id: id,
        name: 'daenerys',
        role: 'OWNER' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        ownerID: ownerID,
      });
    });
  });

  describe('[POST] new valid owner', () => {
    it('should create and return a owner', async () => {
      const id = '98765431';
      const ownerID = '987654321';

      const createdOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      prisma.user.create.mockResolvedValueOnce(createdOwner);

      const owner = await service.create({
        id: id,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
      });

      expect(owner).toEqual({
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        ownerID: ownerID,
      });
    });
  });

  describe('[PUT] update owner that exists', () => {
    it('should update and return the owner', async () => {
      const id = '12345678';
      const ownerID = '987654321';

      const updatedOwner = {
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        ownerID: ownerID,
        vetID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(updatedOwner);

      prisma.user.update.mockResolvedValueOnce(updatedOwner);

      const result = await service.update({
        id: id,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
      });

      expect(result).toEqual({
        id: id,
        role: 'OWNER' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        ownerID: ownerID,
      });
    });
  });

  describe('[DELETE] delete owner that does not exist', () => {
    it('should throw OwnerNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.owner.findUnique.mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow(OwnerNotFoundError);
    });
  });
});
