import { PetType } from '@prisma/client';
import { getPetTypeEnum } from '../../../shared';

export class Pet {
  public readonly id: string;
  public readonly name: string;
  public readonly breed: string;
  public readonly color: string;
  public readonly age: number;
  public readonly weight: number;
  public readonly type: PetType;
  public readonly ownerID: string;

  constructor(
    id: string,
    name: string,
    breed: string,
    color: string,
    age: number,
    weight: number,
    type: PetType,
    ownerID: string
  ) {
    this.id = id;
    this.name = name;
    this.breed = breed;
    this.color = color;
    this.age = age;
    this.weight = weight;
    this.type = type;
    this.ownerID = ownerID;
  }
}
