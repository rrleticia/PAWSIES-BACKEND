import { Role } from '@prisma/client';

export class User {
  public readonly id: string;
  public readonly username: string;
  public readonly role: Role;
  public readonly email: string;
  public password: string;

  constructor(
    id: string,
    username: string,
    role: Role,
    email: string,
    password: string
  ) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.email = email;
    this.password = password;
  }
}
