import { Injectable } from "@angular/core";

import { Store } from "../../base/base.store";
import { UserState } from "./user.state";
import { IUserInteractAction } from "src/app/domain/interfaces/store/user/interact-actions";
import { User } from "src/app/domain/models/User/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserStore extends Store<UserState> {

  constructor() {
    super(new UserState())
  }

  private setAuthorizedUser(user: User): void {
    this.setState({
      ...this.state,
      authorizedUser: user
    });
  }

  private setUserCollection(list: User[]) {
    this.setState({
      ...this.state,
      list: list
    });
  }

  /**
   *
   * @param data : { action }
   */
  public dispatch(data: IUserInteractAction): void {

    switch (data.action) {

      case 'SET_AUTHORIZED_USER':
        this.setAuthorizedUser(data.authUser)
        break;

      case 'SET_USER_COLLECTION':
        this.setUserCollection(data.userCollection);
        break;
    }

  }
}
