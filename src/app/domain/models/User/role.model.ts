import { UserRoleType } from "../../enums/role/role.enum";

export class Role {

  public id?: string;
  public name: UserRoleType;

  constructor(role: UserRoleType) {

    this.name = role;
  }
}
