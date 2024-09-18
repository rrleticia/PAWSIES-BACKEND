import { Role, Specialty } from '@prisma/client';
import {
  VetAlreadyExistsError,
  VetNotFoundError,
  VetValidationError,
} from '../../src/errors';
import {
  PrismaVetRepository,
  PrismaUserRepository,
  Owner,
  IUserRepository,
  IVetRepository,
} from '../../src/infra';
import { VetService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('vet.service', () => {
  let userRepository: IUserRepository;
  let repository: IVetRepository;
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

  describe('[GET ALL] list of vets', () => {
    it('should return a list of vets', async () => {
      const vetsList = [
        {
          id: '1',
          name: 'john',
          role: 'VET' as Role,
          email: 'john@example.com',
          password: 'Password0878%',
          username: 'john_doe',
          ownerID: null,
          vetID: 'vet123',
          vet: { id: 'vet123', specialty: 'CAT' as Specialty },
        },
        {
          id: '2',
          name: 'jane',
          role: 'VET' as Role,
          specialty: 'DOG',
          email: 'jane@example.com',
          password: 'Password0878%',
          username: 'jane_doe',
          ownerID: null,
          vetID: 'vet456',
          vet: { id: 'vet456', specialty: 'DOG' as Specialty },
        },
      ];

      prisma.user.findMany.mockResolvedValueOnce(vetsList);

      const result = await service.getAll();

      expect(result).toEqual([
        {
          id: '1',
          name: 'john',
          role: 'VET' as Role,
          specialty: 'CAT' as Specialty,
          email: 'john@example.com',
          username: 'john_doe',
          vetID: 'vet123',
        },
        {
          id: '2',
          name: 'jane',
          role: 'VET' as Role,
          specialty: 'DOG' as Specialty,
          email: 'jane@example.com',
          username: 'jane_doe',
          vetID: 'vet456',
        },
      ]);
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
        password: 'Caraxys123!',
        ownerID: 'anID',
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

  describe('[GET ONE] vet by :id', () => {
    it('should throw VetNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOneByID(id)).rejects.toThrow(VetNotFoundError);
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
        password: 'Caraxys123!',
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
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
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

  describe('[POST] new invalid vet', () => {
    it('should throw VetAlreadyExistsError', async () => {
      const id = '98765431';
      const vetID = '123456789';

      const existingVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
        vetID: vetID,
      };

      prisma.user.findUnique.mockResolvedValueOnce(existingVet);

      await expect(
        service.create({
          id: id,
          email: 'rhaenyra@gmail.com',
          name: 'rhaenyra',
          username: 'rhaenyra',
          password: 'Caraxys123!',
          specialty: 'CAT_DOG' as Specialty,
        })
      ).rejects.toThrow(VetAlreadyExistsError);
    });
  });

  describe('[POST] new invalid vet', () => {
    it('empty name: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail.com',
        name: '',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('blank name: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail.com',
        name: '     ',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid role: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'NOT_ROLE' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid empty email: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: '',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid blank email: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: '     ',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid email no @: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid email no domain: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid empty username: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: '',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid blank username: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: '    ',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid username min length: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'name',
        password: 'Caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid password no uppercase: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'caraxys123!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid password no number: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys!',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
    });
  });

  describe('[POST] new invalid vet', () => {
    it('invalid password no special character: should throw VetValidationError', async () => {
      const id = '98765431';
      const vetID = '987654321';

      const invalidVet = {
        id: id,
        role: 'VET' as Role,
        email: 'rhaenyra@gmail.com',
        name: 'rhaenyra',
        username: 'rhaenyra',
        password: 'Caraxys123',
        vet: {
          id: vetID,
          specialty: 'CAT_DOG',
        },
        ownerID: null,
      };

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(service.create(invalidVet)).rejects.toThrow(
        VetValidationError
      );
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
        password: 'Caraxys123!',
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
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'Caraxys123!',
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

  describe('[PUT] update vet that does not exist', () => {
    it('should throw VetNotFoundError', async () => {
      const id = '12345678';

      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        service.update({
          id: id,
          name: 'daenerys',
          specialty: 'CAT_DOG',
          email: 'daenerys@gmail.com',
          username: 'rhaenyra',
          password: 'Caraxys123!',
        })
      ).rejects.toThrow(VetNotFoundError);
    });
  });

  describe('[DELETE] delete vet that exists', () => {
    it('should delete the vet with vet object', async () => {
      const id = '12345678';

      const deletedVet = {
        id: id,
        name: 'daenerys',
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        password: 'Password987()',
        vetID: 'vetID',
        ownerID: null,
        vet: {
          id: 'vetID',
          specialty: 'CAT_DOG',
        },
      };

      prisma.user.findUnique.mockResolvedValueOnce(deletedVet);

      prisma.user.delete.mockResolvedValueOnce(deletedVet);

      const result = await service.delete(id);

      expect(result).toEqual({
        id: id,
        name: 'daenerys',
        role: 'VET' as Role,
        email: 'daenerys@gmail.com',
        username: 'rhaenyra',
        specialty: 'CAT_DOG' as Specialty,
        vetID: 'vetID',
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
