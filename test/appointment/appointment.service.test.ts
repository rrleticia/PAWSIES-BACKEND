import { Examination } from '@prisma/client';
import { AppointmentNotFoundError } from '../../src/errors';
import { PrismaAppointmentRepository } from '../../src/infra';
import { AppointmentService } from '../../src/services';
import prisma from '../lib/__mocks__/prisma';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('lib/prisma');

describe('appointment.service', () => {
  let repository: PrismaAppointmentRepository;
  let service: AppointmentService;

  beforeAll(() => {
    repository = new PrismaAppointmentRepository(prisma);
    service = new AppointmentService(repository);
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('[GET ALL] empty list of appointments', () => {
    it('should return a list of appointments', async () => {
      prisma.appointment.findMany.mockResolvedValueOnce([]);

      const empty = await service.getAll();

      expect(empty).toStrictEqual([]);
    });
  });

  describe('[GET ONE] appointment by :id', () => {
    it('should return a appointment by id', async () => {
      const id = '12345678';

      const getAppointment = {
        id: id,
        date: new Date(),
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

  describe('[POST] new valid appointment', () => {
    it('should create and return a appointment', async () => {
      const id = '98765431';

      const createdAppointment = {
        id: id,
        date: new Date(),
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

      const appointment = await service.create(createdAppointment);

      expect(appointment).toEqual(createdAppointment);
    });
  });

  describe('[PUT] update appointment that exists', () => {
    it('should update and return the appointment', async () => {
      const id = '12345678';

      const updatedAppointment = {
        id: id,
        date: new Date(),
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

      const result = await service.update(updatedAppointment);

      expect(result).toEqual(updatedAppointment);
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
