import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { User } from 'src/app/domain/models/User/user.model';
import { UserFeaturesType } from 'src/app/domain/enums/user/user.enum';
import { UserRoleFeaturesService } from '../user-role-features/user-role-features.service';
import { UserRoleType } from 'src/app/domain/enums/role/role.enum';
import { UiStateStore } from '../../+store/global/ui-state/ui-state.store';
import { UiState } from '../../+store/global/ui-state/ui.state';
import { Role } from 'src/app/domain/models/User/role.model';
import { FeaturePermissions } from 'src/app/domain/models/User/feature-permission.model';
import { compareArraysIgnoreOrder, isDefined } from 'src/app/utils/utils';

@UntilDestroy()

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private currentAuthorizedUser: User;

  constructor(
    private uiStateStore: UiStateStore,
    private userRoleFeatureService: UserRoleFeaturesService
  ) { }

  private handleUiStateStoreStream(): void {
    this.uiStateStore.stateStream$
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (state: UiState) => {

          if (isDefined(state.authorizedUser) && !isDefined(this.currentAuthorizedUser)) {
            this.currentAuthorizedUser = state.authorizedUser;
          }
        }
      })
  }

  private checkUserRoleFeatures(role: UserRoleType): boolean {
    // feature validation logic
    return false;
  }

  public setCurrentAuthUser(profile: User): void {
    this.currentAuthorizedUser = profile;
  }

  public checkPermission(selectedRole: UserRoleType, feature: UserFeaturesType): boolean {

    if (isDefined(this.currentAuthorizedUser)) {
      if (selectedRole && !feature && this.currentAuthorizedUser.role.find((r: Role) => r.name === selectedRole)) {
        return true;
      } else if (selectedRole && feature && this.currentAuthorizedUser.role.find((r: Role) => r.name === selectedRole)) {
        return this.checkUserRoleFeatures(selectedRole);
      }
    }

    return false;
  }

  public checkPermissionOnlySelected(selectedRoles: UserRoleType[], feature: UserFeaturesType): boolean {

    if (isDefined(this.currentAuthorizedUser)) {

      const currentUserRoleTypes: UserRoleType[] = [];

      for (const r of this.currentAuthorizedUser.role) {
        currentUserRoleTypes.push(r.name);
      }

      return compareArraysIgnoreOrder(selectedRoles, currentUserRoleTypes);
    }

    return false;
  }

  public assignUserRoleFeatures(userRoles: Role[]): FeaturePermissions {
    const permissions: FeaturePermissions = new FeaturePermissions();

    permissions.featureAccess = [
      'CreateOrder',
      'DeleteOrder',
      'EditOrder',
      'ViewOrder'
    ];

    return permissions;
  }
}
