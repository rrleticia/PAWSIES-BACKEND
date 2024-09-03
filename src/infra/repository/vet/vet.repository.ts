import { PrismaClient } from '@prisma/client';
import { IVetRepository } from '.';
import { Vet } from '../../entities';
import { getSpecialtyEnum } from '../../../shared';

export class PrismaVetRepository implements IVetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Vet[] | undefined> {
    const vets = await this.prisma.vet.findMany({});

    if (!vets) return undefined;

    const parseVets = vets.map((vet) => {
      return new Vet(vet.id, vet.name, vet.specialty);
    });
    return parseVets;
  }

  public async findOneByID(id: string): Promise<Vet | undefined> {
    const vet = await this.prisma.vet.findUnique({
      where: {
        id: id,
      },
    });

    if (!vet) return undefined;

    const parseVet = new Vet(vet.id, vet.name, vet.specialty);

    return parseVet;
  }

  public async save(vet: Vet): Promise<Vet> {
    const createdVet = await this.prisma.vet.create({
      data: {
        name: vet.name,
        specialty: getSpecialtyEnum(vet.specialty),
      },
    });

    const parseVet = new Vet(
      createdVet.id,
      createdVet.name,
      createdVet.specialty
    );

    return parseVet;
  }

  public async update(id: string, vet: Vet): Promise<Vet> {
    const updatedVet = await this.prisma.vet.update({
      where: {
        id: id,
      },
      data: {
        name: vet.name,
        specialty: getSpecialtyEnum(vet.specialty),
      },
    });

    const parseVet = new Vet(
      updatedVet.id,
      updatedVet.name,
      updatedVet.specialty
    );

    return parseVet;
  }

  public async delete(id: string): Promise<Vet> {
    const vet = await this.prisma.vet.delete({
      where: {
        id: id,
      },
    });

    const parseVet = new Vet(vet.id, vet.name, vet.specialty);

    return parseVet;
  }

  public async findOneByName(name: string): Promise<Vet | undefined> {
    const vet = await this.prisma.vet.findUnique({
      where: {
        name: name,
      },
    });

    if (!vet) return undefined;

    const parseVet = new Vet(vet.id, vet.name, vet.specialty);

    return parseVet;
  }
}
