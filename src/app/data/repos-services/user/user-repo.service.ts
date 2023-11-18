import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { IUserRequestResponseData } from "src/app/domain/interfaces/request-response/user.response";
import { User } from "src/app/domain/models/User/user.model";
import {
  IUserCollectionRequestResponseDescription,
  IUserRequestResponseDescription,
  IVisuUserCollectionRequestResponseDescription,
  UserDescription
} from "../../interfaces/descriptions/api/user/description";

import { ApiService } from "../../providers/api/api.service";

@Injectable()
export class UserRepoService {

  constructor(
    private apiService: ApiService
  ) { }

  public authorizedProfile(): Observable<IUserRequestResponseData> {

    return this.apiService.getAuthorizedUserProfileRequest()
      .pipe(
        map((response: IUserRequestResponseDescription) => {

          let intentResponseData: IUserRequestResponseData = {} as IUserRequestResponseData;

          if (response) {
            intentResponseData = {
              result: 'Ok',
              authUserProfile: this.createUser(response.details)
            } as IUserRequestResponseData;
          }

          return intentResponseData;
        })
      );
  }

  public list(): Observable<IUserRequestResponseData> {

    return this.apiService.getUserCollectionRequest()
      .pipe(
        map((response: IVisuUserCollectionRequestResponseDescription) => {

          let intentResponseData: IUserRequestResponseData = {} as IUserRequestResponseData;

          if (response) {
            intentResponseData = {
              result: 'Ok',
              userCollection: this.createUserCollection(response.content)
            } as IUserRequestResponseData;
          }

          return intentResponseData;
        })
      );
  }

  private createUserCollection(userCollectionDescription: UserDescription[]): User[] {
    return userCollectionDescription.map((description: UserDescription) => this.createUser(description));
  }

  private createUser(userDescription: UserDescription): User {

    const user: User = new User(userDescription);

    return user;
  }
}
