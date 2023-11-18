import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { PermissionsService } from "src/app/presentation/services/permissions/permissions.service";
import { IUserRequestResponseData } from "../interfaces/request-response/user.response";
import { UserRepo } from "../repository/user.repo";

@Injectable()
export class UserManager {

  constructor(
    private userRepo: UserRepo,
    private permissionService: PermissionsService
  ) { }

  public list(): Observable<IUserRequestResponseData> {
    return this.userRepo.list();
  }

  // assign user roles

  public authorizedUserRequest(): Observable<IUserRequestResponseData> {
    return this.userRepo.authorizedProfile()
      .pipe(
        map((response: IUserRequestResponseData) => {

          if (response.result === 'Ok') {
            response.authUserProfile.featurePermissions = this.permissionService.assignUserRoleFeatures(response.authUserProfile.role);
          }

          return response
        })
      );
  }
}
