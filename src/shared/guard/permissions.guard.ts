import { IRole } from '../interfaces';

import roles from '../config/roles.json';

export class PermissionsGuard {
  public permissions: any[];

  constructor() {
    this.permissions = [];
  }

  public getPermissionsByRoleName(roleName: string) {
    const role = roles.roles.find((role: IRole) => role.name === roleName);
    return role ? role.permissions : [];
  }
}
