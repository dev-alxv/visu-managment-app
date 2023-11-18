import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

import { doAsyncTask, isDefined } from "src/app/utils/utils";
import { LocalStorageService } from "src/app/utils/local-storage.service";
import { AuthStore } from "../../global/auth/auth.store";
import { AuthenticationManager } from "src/app/domain/usecase-managers/auth-manager";
import { IAuthenticationIntentResponseData } from "src/app/domain/interfaces/intent-response/auth.response";
import { IAuthenticationRequest } from "src/app/domain/interfaces/auth/auth.interfaces";
import { UserService } from "../user/user.service";
import {LoggerService} from "src/app/utils/logger.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly haveAuthToken: boolean;
  private readonly haveRefreshToken: boolean;

  private constructor(
    private authStore: AuthStore,
    private authManager: AuthenticationManager,
    private userService: UserService,
    private localStorage: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private loggerService: LoggerService
  ) {
    this.haveAuthToken = this.checkSession();
    // this.haveRefreshToken = this.checkSession();
  }

  public init(): void {

    if (this.haveRefreshToken) {
      // this.authStore.dispatch({ action: 'HAVE_TOKEN' });
      // this.requestAccessTokenRefresh(this.localStorage.get('rt'));
    }

    if (this.haveAuthToken) {
      this.authStore.dispatch({ action: 'HAVE_TOKEN' });
      this.requestAccessWithLocalToken(this.localStorage.get('jwtToken'));
    }
  }

  public requestAuthentication(authData: IAuthenticationRequest): void {

    if (!this.checkSession()) {
      this.authStore.dispatch({ action: 'AUTHENTICATION_REQUEST_SENT' });

      this.authManager.authenticationRequest(authData)
        .subscribe({
          next: (response: IAuthenticationIntentResponseData) => {
            this.loggerService.info('handleAuthenticationResponse', response, this.constructor.name)
            this.handleAuthenticationResponse(response)
          }
        });
    }
  }

  public requestLogout(): void {
    this.clearSession();
    this.authStore.dispatch({ action: 'DEAUTHORIZE' });
    this.router.navigate(['']);
    this.loggerService.info('logout: ', 'successful', this.constructor.name)
  }

  private requestAccessWithLocalToken(oldToken: string): void {

    // this.authManager.refreshAccessTokenRequest(oldToken)
    //   .subscribe({
    //     next: (response: IAuthenticationIntentResponseData) => this.handleAuthenticationResponse(response)
    //   });

    const tempMock: IAuthenticationIntentResponseData = {
      result: 'Ok',
      token: {
        payload: oldToken
      }
    };

    this.handleAuthenticationResponse(tempMock);
  }

  private handleAuthenticationResponse(response: IAuthenticationIntentResponseData): void {

    const authUserProfileSub: Subscription = new Subscription();

    // const delayTime: number = data.refreshTokenUsed ? 1000 : 3000;

    switch (response.result) {

      case 'Ok':
        // set access token as soon as it is received
        this.authStore.dispatch({ action: 'SET_USER_ACCESS_TOKEN', authResponse: response });
        this.setSession(response.token.payload);

        // For UI animations
        doAsyncTask(1200)
          .subscribe({
            complete: () => {

              authUserProfileSub.add(
                this.userService.getAuthorizedUserProfileData()
                  .subscribe({
                    next: (event: boolean) => {

                      if (event === true) {

                        this.authorizeLoggedInUser();
                        authUserProfileSub.unsubscribe();
                      }
                    }
                  }));

              this.authStore.dispatch({ action: 'AUTHENTICATION_REQUEST_RECEIVED' });
              this.authStore.dispatch({ action: 'SET_AUTH_RESPONSE', authResponse: response });
            }
          });

        break;

      case 'Error':
        this.loggerService.error('Error', response, this.constructor.name) ;
        this.authStore.dispatch({ action: 'AUTHENTICATION_REQUEST_RECEIVED' });
        this.authStore.dispatch({ action: 'SET_AUTH_RESPONSE', authResponse: response });
        break;
    }
  }

  private authorizeLoggedInUser(): void {

    const returnURL: string = isDefined(this.route.snapshot.queryParams['returnUrl']) ? this.route.snapshot.queryParams['returnUrl'] : 'home';

    this.authStore.dispatch({ action: 'AUTHORIZE' });

    this.router.navigate([returnURL]);
  }

  private setSession(token: string): void {
    // Save authentication data and update authorized user data
    this.localStorage.set('jwtToken', token);
    this.localStorage.set('ff-at-latestSession-creation', new Date().getTime());
  }

  private clearSession(): void {
    this.localStorage.remove('jwtToken');
    this.localStorage.remove('ff-at-latestSession-creation');
  }

  private checkSession(): boolean {

    const sessionItem = isDefined(this.localStorage.get('jwtToken'));
    // const haveRefreshToken: boolean = sessionItem ? this.localStorage.get('rt').startsWith('') : false;

    return sessionItem;
  }
}
