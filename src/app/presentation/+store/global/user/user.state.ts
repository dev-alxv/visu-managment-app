import { User } from "src/app/domain/models/User/user.model";

export class UserState {

  constructor(
    public authorizedUser?: User,
    public list?: User[]
  ) {

    // Init user
    this.authorizedUser = undefined;

    // Init user list
    this.list = [];
  }
}
