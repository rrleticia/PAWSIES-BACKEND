import { Specialty } from '@prisma/client';
import { getSpecialtyEnum } from '../../../shared';

export class Vet {
  public readonly id: string;
  public readonly name: string;
  public readonly email: string;
  public readonly username: string;
  public readonly password: string;
  public readonly specialty: Specialty;

  constructor(
    id: string,
    name: string,
    email: string,
    username: string,
    password: string,
    specialty: Specialty
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
    this.specialty = specialty;
  }
}
