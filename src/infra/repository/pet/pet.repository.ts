import { PrismaClient } from '@prisma/client';
import { IPetRepository } from '.';
import { Pet } from '../../entities';
import { getPetTypeEnum, getSpecialtyEnum } from '../../../shared';

export class PrismaPetRepository implements IPetRepository {
  constructor(private readonly prisma: PrismaClient) {}

  public async findAll(): Promise<Pet[] | undefined> {
    const pets = await this.prisma.pet.findMany({});
    if (!pets) return undefined;

    const parsePets = pets.map((pet) => {
      return new Pet(
        pet.id,
        pet.name,
        pet.breed,
        pet.color,
        pet.age,
        pet.weight,
        pet.type,
        pet.ownerID
      );
    });

    return parsePets;
  }

  public async findAllByOwnerID(ownerID: string): Promise<Pet[] | undefined> {
    const pets = await this.prisma.pet.findMany({
      where: {
        ownerID: ownerID,
      },
    });

    if (!pets) return undefined;

    const parsePets = pets.map((pet) => {
      return new Pet(
        pet.id,
        pet.name,
        pet.breed,
        pet.color,
        pet.age,
        pet.weight,
        pet.type,
        pet.ownerID
      );
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

    const parsePets = new Pet(
      pet.id,
      pet.name,
      pet.breed,
      pet.color,
      pet.age,
      pet.weight,
      pet.type,
      pet.ownerID
    );

    return parsePets;
  }

  public async save(pet: Pet): Promise<Pet> {
    const createdPet = await this.prisma.pet.create({
      data: {
        id: pet.id,
        name: pet.name,
        breed: pet.breed,
        color: pet.color,
        age: pet.age,
        weight: pet.weight,
        type: pet.type,
        ownerID: pet.ownerID,
      },
    });

    const parsePet = new Pet(
      createdPet.id,
      createdPet.name,
      createdPet.breed,
      createdPet.color,
      createdPet.age,
      createdPet.weight,
      createdPet.type,
      createdPet.ownerID
    );

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

    const parsePet = new Pet(
      updatedPet.id,
      updatedPet.name,
      updatedPet.breed,
      updatedPet.color,
      updatedPet.age,
      updatedPet.weight,
      updatedPet.type,
      updatedPet.ownerID
    );

    return parsePet;
  }

  public async delete(id: string): Promise<Pet> {
    const pet = await this.prisma.pet.delete({
      where: {
        id: id,
      },
    });

    const parsePet = new Pet(
      pet.id,
      pet.name,
      pet.breed,
      pet.color,
      pet.age,
      pet.weight,
      pet.type,
      pet.ownerID
    );

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

    const parsePet = new Pet(
      pet.id,
      pet.name,
      pet.breed,
      pet.color,
      pet.age,
      pet.weight,
      pet.type,
      pet.ownerID
    );

    return parsePet;
  }
}
