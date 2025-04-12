import { PrismaClient } from '@prisma/client';
import { IPetRepository } from '.';
import { Pet } from '../../entities';
import { getPetTypeEnum } from '../../../shared';

export class PrismaPetRepository implements IPetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Pet[] | undefined> {
    const pets = await this.prisma.pet.findMany({});
    if (!pets) return undefined;

    const parsePets = pets.map((pet) => {
      return Pet.mapFromPrisma(pet);
    });

    return parsePets;
  }

  public async findAllByOwnerUsername(
    username: string
  ): Promise<Pet[] | undefined> {
    const pets = await this.prisma.pet.findMany({
      where: {
        owner: {
          user: {
            username: {
              contains: username,
              mode: 'insensitive',
            },
          },
        },
      },
    });

    if (!pets) return undefined;

    const parsePets = pets.map((pet) => {
      return Pet.mapFromPrisma(pet);
    });

    return parsePets;
  }

  public async findOneByID(id: string): Promise<Pet | undefined> {
    const pet = await this.prisma.pet.findUnique({
      where: {
        id: id,
      },
    });

    if (!pet) return undefined;

    const parsePets = Pet.mapFromPrisma(pet);

    return parsePets;
  }

  public async existsID(id: string): Promise<Boolean> {
    const pet = await this.prisma.pet.findFirst({
      where: {
        id: id,
      },
    });

    if (!pet) return false;
    else return true;
  }

  public async save(pet: Pet): Promise<Pet> {
    console.log(pet.ownerID);
    const createdPet = await this.prisma.pet.create({
      data: {
        name: pet.name,
        breed: pet.breed,
        color: pet.color,
        age: pet.age,
        weight: pet.weight,
        type: getPetTypeEnum(pet.type),
        ownerID: pet.ownerID,
      },
    });

    console.log(createdPet);

    const parsePet = Pet.mapFromPrisma(createdPet);

    return parsePet;
  }

  public async update(id: string, pet: Pet): Promise<Pet> {
    const updatedPet = await this.prisma.pet.update({
      where: {
        id: id,
      },
      data: {
        name: pet.name,
        breed: pet.breed,
        color: pet.color,
        age: pet.age,
        weight: pet.weight,
        type: pet.type,
        ownerID: pet.ownerID,
      },
    });

    const parsePet = Pet.mapFromPrisma(updatedPet);

    return parsePet;
  }

  public async delete(id: string): Promise<Pet> {
    const pet = await this.prisma.pet.delete({
      where: {
        id: id,
      },
    });

    const parsePet = Pet.mapFromPrisma(pet);

    return parsePet;
  }

  public async findOneByOwnerWithNameAndType(
    ownerID: string,
    name: string,
    type: string
  ): Promise<Pet | undefined> {
    const pet = await this.prisma.pet.findFirst({
      where: {
        ownerID: ownerID,
        name: name,
        type: getPetTypeEnum(type),
      },
    });

    if (!pet) return undefined;

    const parsePet = Pet.mapFromPrisma(pet);

    return parsePet;
  }
}
