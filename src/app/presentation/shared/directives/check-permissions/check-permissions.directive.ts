import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { UserRoleType } from 'src/app/domain/enums/role/role.enum';
import { UserFeaturesType } from 'src/app/domain/enums/user/user.enum';
import { PermissionsService } from 'src/app/presentation/services/permissions/permissions.service';

@Directive({
  selector: '[ffCheckPermissions]'
})
export class CheckPermissionsDirective implements OnInit {

  @Input() public ffCheckPermissions: UserRoleType[];
  @Input() public ffCheckPermissionsFeature: UserFeaturesType;
  @Input() public ffCheckPermissionsOnlySelectedRoles: boolean;

  constructor(
    private permissionsService: PermissionsService,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<HTMLElement>
  ) { }

  public ngOnInit(): void {
    this.initiatePermissionCheck();
  }

  private initiatePermissionCheck(): void {

    let accessRoleFound: boolean;

    if (!this.ffCheckPermissionsOnlySelectedRoles) {
      this.ffCheckPermissions.find((role: UserRoleType) => {

        if (!accessRoleFound) {
          if (this.permissionsService.checkPermission(role, this.ffCheckPermissionsFeature)) {
            accessRoleFound = true;
          }
        }

      });
    } else {
      if (!accessRoleFound) {
        if (this.permissionsService.checkPermissionOnlySelected(this.ffCheckPermissions, this.ffCheckPermissionsFeature)) {
          accessRoleFound = true;
        }
      }
    }

    accessRoleFound ? this.viewContainer.createEmbeddedView(this.templateRef) : this.viewContainer.clear();
  }

}
