import { Injectable } from '@angular/core';

import { UserRoleType } from 'src/app/domain/enums/role/role.enum';
import { UserFeaturesType } from 'src/app/domain/enums/user/user.enum';

@Injectable({
  providedIn: 'root'
})
export class UserRoleFeaturesService {

  private readonly adminFeatures: UserFeaturesType[] = [
    'ViewOrder',
    'CreateOrder',
    'DeleteOrder',
    'EditOrder'
  ];

  private readonly supervisorFeatures: UserFeaturesType[] = [
    'ViewOrder',
    'CreateOrder',
    'DeleteOrder',
    'EditOrder'
  ];

  private readonly drafterFeatures: UserFeaturesType[] = [
    'ViewOrder'
  ];

  private readonly customerFeatures: UserFeaturesType[] = [

  ];

  constructor() { }

  public getUserRoleSpecificFeatures(role: UserRoleType): UserFeaturesType[] {

    switch (role) {

      case 'Admin':
        return this.adminFeatures;

      case 'Supervisor':
        return this.supervisorFeatures;

      case 'Drafter':
        return this.drafterFeatures;

      case 'Customer':
        return this.customerFeatures;
    }
  }
}
