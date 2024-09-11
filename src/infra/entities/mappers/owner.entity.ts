import { Role } from '@prisma/client';

export class Owner {
  public readonly id: string;
  public readonly name: string;
  public readonly role: Role;
  public readonly username: string;
  public readonly email: string;
  public password?: string;
  public readonly ownerID?: string | null;

  constructor(
    id: string,
    name: string,
    role: Role,
    username: string,
    email: string,
    password: string,
    ownerID: string | null
  ) {
    this.id = id;
    this.name = name;
    this.username = username;
    this.role = role;
    this.email = email;
    this.password = password;
    this.ownerID = ownerID;
  }
}
