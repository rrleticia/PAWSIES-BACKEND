import { IRole } from '../interfaces';

import roles from '../config/roles.json';

export class RoleGuard {
  public roles: IRole[] = [];

  constructor() {
    this.roles = roles.roles;
  }

  public getRoleByName(name: string) {
    return this.roles.find((role: IRole) => role.name === name);
  }

  public getRoles() {
    return this.roles;
  }
}
