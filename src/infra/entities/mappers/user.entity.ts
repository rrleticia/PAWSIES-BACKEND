import { Role } from '@prisma/client';

export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly role: Role;
  public readonly email: string;
  public password?: string;
  public readonly vetID: string | null;
  public readonly ownerID: string | null;

  constructor(
    id: string,
    username: string,
    role: Role,
    email: string,
    password: string,
    vetID: string | null,
    ownerID: string | null
  ) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.email = email;
    this.password = password;
    this.vetID = vetID;
    this.ownerID = ownerID;
  }
}
