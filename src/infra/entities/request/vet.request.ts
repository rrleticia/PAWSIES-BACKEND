import { Role, Specialty } from '@prisma/client';

export class VetRequest {
  public readonly id: string;
  public readonly name: string;
  public readonly specialty: Specialty;
  public readonly username: string;
  public readonly email: string;
  public password: string;
  public readonly vetID: string | null;

  constructor(
    id: string,
    name: string,
    specialty: Specialty,
    username: string,
    email: string,
    password: string,
    vetID: string | null
  ) {
    this.id = id;
    this.name = name;
    this.specialty = specialty;
    this.username = username;
    this.email = email;
    this.password = password;
    this.vetID = vetID;
  }
}
