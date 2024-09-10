import { Role } from '@prisma/client';
import { UserNotFoundError } from '../../src/errors';
import { PrismaUserRepository } from '../../src/infra';
import { UserService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('user.service', () => {
  let repository: PrismaUserRepository;
  let service: UserService;
  beforeAll(() => {
    repository = new PrismaUserRepository(prisma);
    service = new UserService(repository);
  });
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  describe('[GET ALL] empty list', () => {
    it('should return a list of users', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });
  describe('[GET ONE] user by :id', () => {
    it('should return a list of users', async () => {
      const id = '12345678';

      prisma.user.findUnique.mockResolvedValueOnce({
        id: id,
        role: 'ADMIN',
        email: 'daenerys@gmail.com',
        username: 'daenerys',
        password: 'drogon123!',
        vetID: null,
        ownerID: null,
      });

      const users = await service.getOneByID(id);

      expect(users).toEqual({
        id: '12345678',
        role: 'ADMIN',
        email: 'daenerys@gmail.com',
        username: 'daenerys',
        password: 'drogon123!',
        vetID: null,
        ownerID: null,
      });
    });
  });
  describe('[POST] new valid user', () => {
    it('should create and return a user', async () => {
      const id = '12345678';

      const createdUser = {
        id: id,
        role: 'ADMIN' as Role,
        email: 'daenerys@gmail.com',
        username: 'daenerys',
        password: 'drogon123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      prisma.user.create.mockResolvedValueOnce(createdUser);

      prisma.user.findUnique.mockResolvedValueOnce(createdUser);

      const user = await service.create(createdUser);

      expect(user).toEqual(createdUser);
    });
  });
  describe('[PUT] update user that exists', () => {
    it('should update and return the user', async () => {
      const id = '12345678';

      const updatedUser = {
        id: id,
        role: 'ADMIN' as Role,
        email: 'updated_email@gmail.com',
        username: 'updated_username',
        password: 'new_password',
        vetID: null,
        ownerID: null,
      };

      // Mock finding the user (user exists)
      prisma.user.findUnique.mockResolvedValueOnce(updatedUser);
      // Mock the update operation
      prisma.user.update.mockResolvedValueOnce(updatedUser);

      const result = await service.update(updatedUser);

      expect(result).toEqual(updatedUser);
    });
  });
  describe('[DELETE] delete user that does not exist', () => {
    it('should throw UserNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow(UserNotFoundError);
    });
  });
});
