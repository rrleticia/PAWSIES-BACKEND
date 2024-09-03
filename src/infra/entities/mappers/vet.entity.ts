import { Specialty } from '@prisma/client';

export class Vet {
  public readonly id: string;
  public readonly name: string;
  public readonly specialty: Specialty;

  constructor(id: string, name: string, specialty: Specialty) {
    this.id = id;
    this.name = name;
    this.specialty = specialty;
  }
}
