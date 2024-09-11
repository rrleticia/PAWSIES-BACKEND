import { Role, Specialty } from '@prisma/client';

export class Vet {
  public readonly id: string;
  public readonly name: string;
  public readonly specialty: Specialty | null;
  public readonly role: Role;
  public readonly username: string;
  public readonly email: string;
  public password?: string;
  public readonly vetID?: string | null;

  constructor(
    id: string,
    name: string,
    specialty: Specialty | null,
    role: Role,
    username: string,
    email: string,
    password: string,
    vetID: string | null
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.role = role;
    this.email = email;
    this.password = password;
    this.specialty = specialty;
    this.vetID = vetID;
  }
}
