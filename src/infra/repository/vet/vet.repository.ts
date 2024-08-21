import { PrismaClient } from '@prisma/client';
import { IVetRepository } from '.';
import { Vet } from '../../entities';
import { getSpecialtyEnum } from '../../../shared';

export class PrismaVetRepository implements IVetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Vet[]> {
    return this.prisma.vet.findMany({});
  }

  public async findOneByID(id: string): Promise<Vet | undefined> {
    const vet = await this.prisma.vet.findUnique({
      where: {
        id: id,
      },
    });

    if (!vet) return undefined;

    const parseVet = new Vet(
      vet.id,
      vet.name,
      vet.email,
      vet.username,
      vet.password,
      vet.specialty
    );

    return parseVet;
  }

  public async save(vet: Vet): Promise<Vet> {
    return await this.prisma.vet.create({
      data: {
        email: vet.email,
        username: vet.username,
        name: vet.name,
        password: vet.password,
        specialty: getSpecialtyEnum(vet.specialty),
      },
    });
  }

  public async update(id: string, vet: Vet): Promise<Vet> {
    return await this.prisma.vet.update({
      where: {
        id: id,
      },
      data: {
        email: vet.email,
        username: vet.username,
        name: vet.name,
        specialty: getSpecialtyEnum(vet.specialty),
      },
    });
  }

  public async delete(id: string): Promise<Vet> {
    return await this.prisma.vet.delete({
      where: {
        id: id,
      },
    });
  }

  public async findOneByEmailAndUsername(
    email: string,
    username: string
  ): Promise<Vet | undefined> {
    const vet = await this.prisma.vet.findUnique({
      where: {
        email,
        username,
      },
    });

    if (!vet) return undefined;

    const parseVet = new Vet(
      vet.id,
      vet.name,
      vet.email,
      vet.username,
      vet.password,
      vet.specialty
    );

    return parseVet;
  }
}
