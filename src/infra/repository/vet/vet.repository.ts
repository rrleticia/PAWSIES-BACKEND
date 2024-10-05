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
      const parseVet = Vet.mapFromPrisma(vet, vet.vet!);

      delete parseVet.password;
      return parseVet;
    });

    return parseVets;
  }

  public async findOneByID(id: string): Promise<Vet | undefined> {
    const vet = await this.prisma.user.findUnique({
      where: {
        id: id,
        role: getRoleEnum('VET'),
      },
      include: { vet: true },
    });

    if (!vet) return undefined;

    const parseVet = Vet.mapFromPrisma(vet, vet.vet!);

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

    const parseVet = Vet.mapFromPrisma(createdVet, createdVet.vet!);

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
        username: vet.username,
        email: vet.email,
        password: vet.password || undefined,
        vet: {
          create: {
            specialty: getSpecialtyEnum(vet.specialty),
          },
        },
      },
      include: { vet: true },
    });

    const parseVet = Vet.mapFromPrisma(updatedVet, updatedVet.vet!);

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

    const parseVet = Vet.mapFromPrisma(vet, vet.vet!);

    delete parseVet.password;
    return parseVet;
  }
}
