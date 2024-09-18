import { Role } from '@prisma/client';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
  UserValidationError,
} from '../../src/errors';
import { IUserRepository, PrismaUserRepository } from '../../src/infra';
import { UserService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('user.service', () => {
  let repository: IUserRepository;
  let service: UserService;

  beforeAll(() => {
    repository = new PrismaUserRepository(prisma);
    service = new UserService(repository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('[GET ALL] empty list of users', () => {
    it('should return a list of users', async () => {
      prisma.user.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ALL] list of users', () => {
    it('should return a list of users', async () => {
      const usersList = [
        {
          id: '1',
          name: 'name',
          role: 'ADMIN' as Role,
          email: 'daenerys@gmail.com',
          username: 'daenerys',
          password: 'Drogon123!',
          vetID: null,
          ownerID: null,
        },
        {
          id: '2',
          name: 'name',
          role: 'ADMIN' as Role,
          email: 'daenerys@gmail.com',
          username: 'daenerys',
          password: 'Drogon123!',
          vetID: null,
          ownerID: null,
        },
      ];
      prisma.user.findMany.mockResolvedValueOnce(usersList);

      const users = await service.getAll();

      expect(users).toEqual([
        {
          id: '1',
          name: 'name',
          role: 'ADMIN',
          email: 'daenerys@gmail.com',
          username: 'daenerys',
          vetID: null,
          ownerID: null,
        },
        {
          id: '2',
          name: 'name',
          role: 'ADMIN',
          email: 'daenerys@gmail.com',
          username: 'daenerys',
          vetID: null,
          ownerID: null,
        },
      ]);
    });
  });

  describe('[GET ONE] user by :id', () => {
    it('should return a user by id', async () => {
      const id = '12345678';

      const getUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'daenerys@gmail.com',
        username: 'daenerys',
        password: 'Drogon123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(getUser);

      const user = await service.getOneByID(id);

      expect(user).toEqual({
        id: '12345678',
        name: 'name',
        role: 'ADMIN',
        email: 'daenerys@gmail.com',
        username: 'daenerys',
        vetID: null,
        ownerID: null,
      });
    });
  });

  describe('[GET ONE] user by :id', () => {
    it('should throw VetNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOneByID(id)).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('[GET ONE] user by :id', () => {
    it('should throw UserNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOneByID(id)).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('[POST] new valid user', () => {
    it('should create and return a user', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      prisma.user.create.mockResolvedValueOnce(createdUser);

      const user = await service.create(createdUser);

      expect(user).toEqual({
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail.com',
        username: 'rhaenyra',
        vetID: null,
        ownerID: null,
      });
    });
  });

  describe('[POST] new invalid user', () => {
    it('should throw UserAlreadyExistsError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(createdUser);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserAlreadyExistsError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('empty name: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: '',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('blank name: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: '     ',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid role: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'NOT_ROLE' as Role,
        email: 'rhaenyra@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid empty email: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: '',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid blank email: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: '    ',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid email no @: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid email no domain: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid empty username: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail',
        username: '',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid blank username: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail',
        username: '     ',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid username min length: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail',
        username: 'user',
        password: 'Caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid password no uppercase: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail',
        username: 'user',
        password: 'caraxys123!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid password no number: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail',
        username: 'user',
        password: 'Caraxys!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[POST] new invalid user', () => {
    it('invalid password no special character: should throw UserValidationError', async () => {
      const id = '98765431';

      const createdUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'rhaenyra@gmail',
        username: 'user',
        password: 'Caraxys123',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(createdUser)).rejects.toThrow(
        UserValidationError
      );
    });
  });

  describe('[PUT] update user that exists', () => {
    it('should update and return the user', async () => {
      const id = '12345678';

      const updatedUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'updated_email@gmail.com',
        username: 'updated_username',
        password: 'Updated_passcode1!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(updatedUser);

      prisma.user.update.mockResolvedValueOnce(updatedUser);

      const result = await service.update(updatedUser);

      expect(result).toEqual({
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'updated_email@gmail.com',
        username: 'updated_username',
        vetID: null,
        ownerID: null,
      });
    });
  });

  describe('[PUT] update user that does not exists', () => {
    it('should throw UserNotFoundError', async () => {
      const id = '12345678';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      expect(
        service.update({
          id: id,
          name: 'name',
          role: 'ADMIN' as Role,
          email: 'updated_email@gmail.com',
          username: 'updated_username',
          password: 'UpdatedP12!',
          vetID: null,
          ownerID: null,
        })
      ).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('[DELETE] delete user that does exist', () => {
    it('should delete and return the user', async () => {
      const id = '12345678';

      const deletedUser = {
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'updated_email@gmail.com',
        username: 'updated_username',
        password: 'Updated_passcode1!',
        vetID: null,
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(deletedUser);

      prisma.user.delete.mockResolvedValueOnce(deletedUser);

      const result = await service.delete(id);

      expect(result).toEqual({
        id: id,
        name: 'name',
        role: 'ADMIN' as Role,
        email: 'updated_email@gmail.com',
        username: 'updated_username',
        vetID: null,
        ownerID: null,
      });
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
