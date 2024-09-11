import { PrismaClient } from '@prisma/client';
import { IVetRepository } from '.';
import { Vet } from '../../entities';
import { getRoleEnum, getSpecialtyEnum } from '../../../shared';

export class PrismaVetRepository implements IVetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Vet[] | undefined> {
    const vets = await this.prisma.user.findMany({
      where: {
        vetID: {
          not: null,
        },
      },
      include: { vet: true },
    });

    if (!vets) return undefined;

    const parseVets = vets.map((vet) => {
      let parseVet = new Vet(
        vet.id,
        vet.name,
        vet.vet!.specialty,
        vet.role,
        vet.username,
        vet.email,
        vet.password,
        vet.vetID
      );
      delete parseVet.password;
      return parseVet;
    });
    return parseVets;
  }

  public async findOneByID(id: string): Promise<Vet | undefined> {
    const vet = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: { vet: true },
    });

    if (!vet) return undefined;

    const parseVet = new Vet(
      vet.id,
      vet.name,
      vet.vet!.specialty,
      vet.role,
      vet.username,
      vet.email,
      vet.password,
      vet.vetID
    );

    delete parseVet.password;
    return parseVet;
  }

  public async save(vet: Vet): Promise<Vet | undefined> {
    if (!vet.password) return undefined;

    const createdVet = await this.prisma.user.create({
      data: {
        name: vet.name,
        role: getRoleEnum('VET'),
        username: vet.username,
        email: vet.email,
        password: vet.password,
        vet: {
          create: {
            specialty: getSpecialtyEnum(vet.specialty),
          },
        },
      },
      include: { vet: true },
    });

    if (!createdVet) return undefined;

    const parseVet = new Vet(
      createdVet.id,
      createdVet.name,
      createdVet.vet!.specialty,
      createdVet.role,
      createdVet.username,
      createdVet.email,
      createdVet.password,
      createdVet.vetID
    );

    delete parseVet.password;
    return parseVet;
  }

  public async update(id: string, vet: Vet): Promise<Vet> {
    const updatedVet = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name: vet.name,
        role: getRoleEnum('VET'),
        username: vet.username,
        email: vet.email,
        password: vet.password,
        vet: {
          create: {
            specialty: getSpecialtyEnum(vet.specialty),
          },
        },
      },
      include: { vet: true },
    });

    const parseVet = new Vet(
      updatedVet.id,
      updatedVet.name,
      updatedVet.vet!.specialty,
      updatedVet.role,
      updatedVet.username,
      updatedVet.email,
      updatedVet.password,
      updatedVet.vetID
    );

    delete parseVet.password;
    return parseVet;
  }

  public async delete(id: string): Promise<Vet> {
    const vet = await this.prisma.user.delete({
      where: {
        id: id,
      },
      include: { vet: true },
    });

    const parseVet = new Vet(
      vet.id,
      vet.name,
      vet.vet!.specialty,
      vet.role,
      vet.username,
      vet.email,
      vet.password,
      vet.vetID
    );

    delete parseVet.password;
    return parseVet;
  }
}
