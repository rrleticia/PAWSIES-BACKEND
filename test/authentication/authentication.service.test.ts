import { Role } from '@prisma/client';
import { UserNotFoundError, UserUnauthorizedError } from '../../src/errors';
import { PrismaUserRepository } from '../../src/infra';
import { AuthenticationService, UserService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import bcrypt from 'bcrypt';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('user.service', () => {
  let repository: PrismaUserRepository;
  let service: AuthenticationService;

  beforeAll(() => {
    repository = new PrismaUserRepository(prisma);
    service = new AuthenticationService(repository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mock('bcrypt', async () => {
      return {
        default: {
          hash: vi.fn((password, saltRounds) => {
            if (saltRounds === 11) {
              return Promise.resolve('mockedHashedPassword');
            }
            throw new Error('Unexpected saltRounds');
          }),
          compare: vi.fn((password, hashedPassword) => {
            return Promise.resolve(
              password === 'Drogon123!' &&
                hashedPassword === 'mockedHashedPassword'
            );
          }),
        },
      };
    });
  });

  describe('[CREATE LOGIN] login a user', () => {
    it('should login a user successfully', async () => {
      const id = '12345678';
      const email = 'daenerys@gmail.com';
      const password = 'Drogon123!';
      const hashedPassword = await bcrypt.hash(password, 11);

      const user = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: email,
        username: 'daenerys',
        password: hashedPassword,
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(user);

      const result = await service.login(email, password);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('loggedUser');
    });
  });

  describe('[CREATE LOGIN] login a user', () => {
    it('wrong email: should throw UserNotFoundError', async () => {
      const password = 'Drogon123!';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.login('daerys@gmail.com', password)).rejects.toThrow(
        UserNotFoundError
      );
    });
  });

  describe('[CREATE LOGIN] login a user', () => {
    it('wrong password: should throw UserUnauthorizedError', async () => {
      const id = '12345678';
      const email = 'daenerys@gmail.com';
      const password = 'Drogon123!';
      const hashedPassword = await bcrypt.hash(password, 11);

      const user = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: email,
        username: 'daenerys',
        password: hashedPassword,
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(user);

      await expect(service.login(email, 'Dragon123!')).rejects.toThrow(
        UserUnauthorizedError
      );
    });
  });

  describe('[CREATE LOGOUT] logout a user', () => {
    it('wrong email: should throw UserNotFoundError', async () => {
      const password = 'Drogon123!';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.logout('daerys@gmail.com', password)
      ).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('[CREATE LOGOUT] logout a user', () => {
    it('should logout a user successfully', async () => {
      const id = '12345678';
      const email = 'daenerys@gmail.com';
      const password = 'Drogon123!';
      const hashedPassword = await bcrypt.hash(password, 11);

      const user = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: email,
        username: 'daenerys',
        password: hashedPassword,
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(user);

      const { token, loggedUser } = await service.login(email, password);

      prisma.user.findUnique.mockResolvedValueOnce(user);

      const result = await service.logout(email, token);

      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('loggedUser');
    });
  });
});
