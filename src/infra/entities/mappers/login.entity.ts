import { Role } from '@prisma/client';

export class LoginUser {
  public readonly role: Role;
  public readonly email: string;
  public password?: string;

  constructor(role: Role, email: string, password?: string) {
    this.role = role;
    this.email = email;
    this.password = password;
  }
}
