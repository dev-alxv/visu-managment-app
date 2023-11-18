import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from 'src/app/domain/models/User/user.model';
import { UserStore } from '../../global/user/user.store';
import { UserManager } from 'src/app/domain/usecase-managers/user-manager';
import { IUserRequestResponseData } from 'src/app/domain/interfaces/request-response/user.response';
import { UiStateStore } from '../../global/ui-state/ui-state.store';
import { PermissionsService } from 'src/app/presentation/services/permissions/permissions.service';
import {LoggerService} from "src/app/utils/logger.service";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private permissionService: PermissionsService,
    private userStore: UserStore,
    private uiStateStore: UiStateStore,
    private userManager: UserManager,
    private loggerService: LoggerService
  ) { }

  public getAuthorizedUserProfileData(): Observable<boolean> {

    const authProfileReceivedEvent$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    const authProfileReceivedEventStream$: Observable<boolean> = authProfileReceivedEvent$.asObservable();

    this.userManager.authorizedUserRequest()
      .pipe(
        map((response: IUserRequestResponseData) => {
          const user: User = response.authUserProfile;

          // Change user role for test purpose
          response.authUserProfile = {
            ...response.authUserProfile,
            // role: [
            //   {
            //     name: 'Supervisor'
            //   }
            // ]
          };

          return response;
        })
      )
      .subscribe({
        next: (response: IUserRequestResponseData) => authProfileReceivedEvent$.next(this.handleAuthorizedUserProfile(response)),
        error: (err: any) => this.loggerService.error('Error', this.constructor.name, err)
      });

    return authProfileReceivedEventStream$;
  }

  private getUserCollection(): void {

    this.userManager.list()
      .subscribe({
        next: ((response: IUserRequestResponseData) => this.parseUserCollectionRequestResponse(response)),
        error: (err: any) => this.loggerService.error('Error', this.constructor.name, err)
      });
  }

  private handleAuthorizedUserProfile(response: IUserRequestResponseData): boolean {

    let responseResult: boolean;

    if (response.result === 'Ok') {

      responseResult = true;

      this.permissionService.setCurrentAuthUser(response.authUserProfile);
      this.getUserCollection();

      this.uiStateStore.dispatchAction({
        action: 'SET_AUTHORIZED_USER',
        authUser: response.authUserProfile
      });
      this.loggerService.info('Set user: ', response.authUserProfile.contact[0].profile.firstName, this.constructor.name)
    }

    return responseResult;
  }

  private parseUserCollectionRequestResponse(data: IUserRequestResponseData): void {

    this.userStore.dispatch({
      action: 'SET_USER_COLLECTION',
      userCollection: data.userCollection
    });
    this.loggerService.info('Set user collection, items: ', data.userCollection.length, this.constructor.name)
  }
}
