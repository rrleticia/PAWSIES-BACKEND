import { PrismaClient } from '@prisma/client';
import { IVetRepository } from '.';
import { Vet, VetRequest } from '../../entities';
import { getRoleEnum, getSpecialtyEnum } from '../../../shared';

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

  public async save(vet: VetRequest): Promise<Vet | undefined> {
    const createdUser = await this.prisma.user.create({
      data: {
        username: vet.username,
        role: getRoleEnum('VET'),
        email: vet.email,
        password: vet.password,
        vet: {
          create: {
            name: vet.name,
            specialty: getSpecialtyEnum(vet.specialty),
          },
        },
      },
    });

    let createdVet;
    if (createdUser.vetID)
      createdVet = await this.prisma.vet.findUnique({
        where: {
          id: createdUser.vetID,
        },
      });

    if (!createdVet) return undefined;

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
