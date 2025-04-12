import { PetType, Pet as PrismaPet } from '@prisma/client';

export class Pet {
  public readonly id: string;
  public readonly name: string;
  public readonly breed: string;
  public readonly color: string;
  public readonly age: number;
  public readonly weight: number;
  public readonly type: PetType;
  public readonly ownerID: string;
  public readonly createdAt?: Date | null;
  public readonly updatedAt?: Date | null;

  constructor(
    id: string,
    name: string,
    breed: string,
    color: string,
    age: number,
    weight: number,
    type: PetType,
    ownerID: string,
    createdAt: Date | null,
    updatedAt: Date | null
  ) {
    this.id = id;
    this.name = name;
    this.breed = breed;
    this.color = color;
    this.age = age;
    this.weight = weight;
    this.type = type;
    this.ownerID = ownerID;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public static mapFromPrisma(prismaPet: PrismaPet): Pet {
    return new Pet(
      prismaPet.id,
      prismaPet.name,
      prismaPet.breed,
      prismaPet.color,
      prismaPet.age,
      prismaPet.weight,
      prismaPet.type,
      prismaPet.ownerID,
      prismaPet.createdAt,
      prismaPet.updatedAt
    );
  }
}
