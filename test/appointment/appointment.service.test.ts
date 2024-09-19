import { Examination, PetType, Role, Specialty } from '@prisma/client';
import {
  AppointmentAlreadyExistsError,
  AppointmentNotFoundError,
  AppointmentValidationError,
  OwnerNotFoundError,
  PetNotFoundError,
  VetNotFoundError,
} from '../../src/errors';
import {
  IAppointmentRepository,
  IOwnerRepository,
  IPetRepository,
  IVetRepository,
  PrismaAppointmentRepository,
  PrismaOwnerRepository,
  PrismaPetRepository,
  PrismaVetRepository,
} from '../../src/infra';
import { AppointmentService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('appointment.service', () => {
  let repository: IAppointmentRepository;
  let ownerRepository: IOwnerRepository;
  let vetRepository: IVetRepository;
  let petRepository: IPetRepository;
  let service: AppointmentService;

  beforeAll(() => {
    repository = new PrismaAppointmentRepository(prisma);
    ownerRepository = new PrismaOwnerRepository(prisma);
    vetRepository = new PrismaVetRepository(prisma);
    petRepository = new PrismaPetRepository(prisma);
    service = new AppointmentService(
      repository,
      ownerRepository,
      vetRepository,
      petRepository
    );
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    prisma.user.findUnique.mockImplementation((query): any => {
      if (query.where.id === '3') {
        return Promise.resolve({
          id: '3',
          role: 'OWNER' as Role,
          email: 'rhaenyra@gmail.com',
          name: 'rhaenyra',
          username: 'rhaenyra',
          password: 'Caraxys123!',
          ownerID: '3',
          vetID: null,
        });
      } else if (query.where.id === '1') {
        return Promise.resolve({
          id: '1',
          name: 'daenerys',
          role: 'VET' as Role,
          email: 'daenerys@gmail.com',
          username: 'rhaenyra',
          password: 'Caraxys123!',
          ownerID: 'anID',
          vetID: '1',
          vet: {
            id: '1',
            specialty: 'CAT_DOG' as Specialty,
          },
        });
      }
      return Promise.resolve(null);
    });
    prisma.pet.findUnique.mockResolvedValueOnce({
      id: '2',
      name: 'pet',
      breed: 'breed',
      color: 'color',
      age: 12,
      weight: 12,
      type: 'CAT' as PetType,
      ownerID: '3',
    });
  });

  describe('[GET ALL] empty list of appointments', () => {
    it('should return a list of appointments', async () => {
      prisma.appointment.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ALL] list of appointments', () => {
    it('should return a list of appointments', async () => {
      const dateString = '23/09/2025';

      const appointmentsList = [
        {
          id: '1',
          date: new Date(dateString),
          hour: '10H',
          status: false,
          examination: 'ROUTINE' as Examination,
          observations: 'Some observations',
          vetID: '1',
          petID: '2',
          ownerID: '3',
        },
        {
          id: '2',
          date: new Date(dateString),
          hour: '10H',
          status: false,
          examination: 'ROUTINE' as Examination,
          observations: 'Some observations',
          vetID: '1',
          petID: '2',
          ownerID: '3',
        },
      ];

      prisma.appointment.findMany.mockResolvedValueOnce(appointmentsList);

      const appointments = await service.getAll();

      expect(appointments).toEqual(appointmentsList);
    });
  });

  describe('[GET ONE] appointment by :id', () => {
    it('should return a appointment by id', async () => {
      const id = '12345678';
      const dateString = '23/09/2025';

      const getAppointment = {
        id: id,
        date: new Date(dateString),
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      prisma.appointment.findUnique.mockResolvedValueOnce(getAppointment);

      const appointment = await service.getOneByID(id);

      expect(appointment).toEqual(getAppointment);
    });
  });

  describe('[GET ONE] appointment by :id', () => {
    it('should throw AppointmentNotFound', async () => {
      const id = 'non_existent_id';

      prisma.appointment.findUnique.mockResolvedValueOnce(null);

      await expect(service.getOneByID(id)).rejects.toThrow(
        AppointmentNotFoundError
      );
    });
  });

  describe('[CREATE] new valid appointment', () => {
    it('should create and return a appointment', async () => {
      const id = '98765431';

      const createdAppointment = {
        id: id,
        date: new Date('23/09/2025'),
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      prisma.appointment.findUnique.mockResolvedValueOnce(null);

      prisma.appointment.create.mockResolvedValueOnce(createdAppointment);

      const appointment = await service.create({
        id: id,
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      });

      expect(appointment).toEqual(createdAppointment);
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('should throw AppointmentAlreadyExistsError', async () => {
      const id = '98765431';

      const existingAppointment = {
        id: '12345678',
        date: new Date('23/09/2025'),
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      prisma.appointment.findFirst.mockImplementation((query): any => {
        if (!query || !query!.where) return Promise.resolve(null);
        if (query!.where!.ownerID === '3') {
          return Promise.resolve({
            id: '12345678',
            date: new Date('23/09/2025'),
            hour: '10H',
            status: false,
            examination: 'ROUTINE' as Examination,
            observations: 'Some observations',
            vetID: '1',
            petID: '2',
            ownerID: '3',
          });
        } else if (query!.where!.vetID === '1') {
          return Promise.resolve({
            id: '12345678',
            date: new Date('23/09/2025'),
            hour: '10H',
            status: false,
            examination: 'ROUTINE' as Examination,
            observations: 'Some observations',
            vetID: '1',
            petID: '2',
            ownerID: '3',
          });
        }

        return Promise.resolve(null);
      });

      prisma.appointment.findUnique.mockResolvedValueOnce(existingAppointment);

      await expect(
        service.create({
          id: '12345678',
          date: '23/09/2025',
          hour: '10H',
          status: false,
          examination: 'ROUTINE' as Examination,
          observations: 'Some observations',
          vetID: '1',
          petID: '2',
          ownerID: '3',
        })
      ).rejects.toThrow(AppointmentAlreadyExistsError);
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('empty date: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('blank date: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '     ',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('invalid date format: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23-09-2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('past appointment date: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '21/09/2021',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('invalid empty hour format: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('invalid hour format: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '25H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('invalid examination type: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: '' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('invalid examination type: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'INVALID_EXAM' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('missing observations: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: '',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('invalid empty vetID: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '',
        petID: '2',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('invalid empty petID: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '',
        ownerID: '3',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('invalid empty ownerID: should throw AppointmentValidationError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '',
      };

      await expect(service.create(createdAppointment)).rejects.toThrow(
        AppointmentValidationError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('ownerID invalid: should throw OwnerNotFoundError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '143',
      };

      vi.restoreAllMocks();

      prisma.user.findUnique.mockImplementation((query): any => {
        if (query.where.id === '1') {
          // Mock for vet
          return Promise.resolve({
            id: '1',
            name: 'daenerys',
            role: 'VET' as Role,
            email: 'daenerys@gmail.com',
            username: 'rhaenyra',
            password: 'Caraxys123!',
            ownerID: 'anID',
            vetID: '1',
            vet: {
              id: '1',
              specialty: 'CAT_DOG' as Specialty,
            },
          });
        }
        return Promise.resolve(null);
      });

      await expect(service.create(createdAppointment)).rejects.toThrow(
        OwnerNotFoundError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('ownerID invalid: should throw VetNotFoundError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      vi.restoreAllMocks();

      prisma.user.findUnique.mockImplementation((query): any => {
        if (query.where.id === '3') {
          // Mock for owner
          return Promise.resolve({
            id: '3',
            role: 'OWNER' as Role,
            email: 'rhaenyra@gmail.com',
            name: 'rhaenyra',
            username: 'rhaenyra',
            password: 'Caraxys123!',
            ownerID: '3',
            vetID: null,
          });
        }
        return Promise.resolve(null);
      });

      prisma.pet.findUnique.mockResolvedValue(null);

      await expect(service.create(createdAppointment)).rejects.toThrow(
        VetNotFoundError
      );
    });
  });

  describe('[CREATE] new invalid appointment', () => {
    it('ownerID invalid: should throw PetNotFoundError', async () => {
      const createdAppointment = {
        id: '12345678',
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      vi.restoreAllMocks();

      prisma.user.findUnique.mockImplementation((query): any => {
        if (query.where.id === '3') {
          // Mock for owner
          return Promise.resolve({
            id: '3',
            role: 'OWNER' as Role,
            email: 'rhaenyra@gmail.com',
            name: 'rhaenyra',
            username: 'rhaenyra',
            password: 'Caraxys123!',
            ownerID: '3',
            vetID: null,
          });
        } else if (query.where.id === '1') {
          // Mock for vet
          return Promise.resolve({
            id: '1',
            name: 'daenerys',
            role: 'VET' as Role,
            email: 'daenerys@gmail.com',
            username: 'rhaenyra',
            password: 'Caraxys123!',
            ownerID: 'anID',
            vetID: '1',
            vet: {
              id: '1',
              specialty: 'CAT_DOG' as Specialty,
            },
          });
        }
        return Promise.resolve(null);
      });

      prisma.pet.findUnique.mockResolvedValue(null);

      await expect(service.create(createdAppointment)).rejects.toThrow(
        PetNotFoundError
      );
    });
  });

  describe('[UPDATE] update appointment that exists', () => {
    it('should update and return the appointment', async () => {
      const id = '12345678';

      const updatedAppointment = {
        id: id,
        date: new Date('23/09/2025'),
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      prisma.appointment.findUnique.mockResolvedValueOnce(updatedAppointment);

      prisma.appointment.update.mockResolvedValueOnce(updatedAppointment);

      const result = await service.update({
        id: id,
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      });

      expect(result).toEqual(updatedAppointment);
    });
  });

  describe('[UPDATE] update appointment that not exist', () => {
    it('should update and return the appointment', async () => {
      const id = '12345678';

      const updatedAppointment = {
        id: id,
        date: '23/09/2025',
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      prisma.appointment.findUnique.mockResolvedValueOnce(null);

      await expect(service.update(updatedAppointment)).rejects.toThrow(
        AppointmentNotFoundError
      );
    });
  });

  describe('[DELETE] delete appointment that does exist', () => {
    it('should throw AppointmentNotFoundError', async () => {
      const id = '12345678';

      const deletedAppointment = {
        id: id,
        date: new Date('23/09/2025'),
        hour: '10H',
        status: false,
        examination: 'ROUTINE' as Examination,
        observations: 'Some observations',
        vetID: '1',
        petID: '2',
        ownerID: '3',
      };

      prisma.appointment.findUnique.mockResolvedValueOnce(deletedAppointment);

      prisma.appointment.delete.mockResolvedValueOnce(deletedAppointment);

      const result = await service.delete(id);

      expect(result).toEqual(deletedAppointment);
    });
  });

  describe('[DELETE] delete appointment that does not exist', () => {
    it('should throw AppointmentNotFoundError', async () => {
      const id = 'non_existent_id';

      prisma.appointment.findUnique.mockResolvedValueOnce(null);

      await expect(service.delete(id)).rejects.toThrow(
        AppointmentNotFoundError
      );
    });
  });
});
