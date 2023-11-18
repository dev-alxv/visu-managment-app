import { Injectable } from "@angular/core";

import { Store } from "../../base/base.store";
import { AuthenticationState } from "./auth.state";
import { IAuthStoreInteractAction } from "src/app/domain/interfaces/store/auth/interact-actions";
import { AuthResponse, IAuthorizedUser } from "src/app/domain/interfaces/auth/auth.interfaces";
import { User } from "src/app/domain/models/User/user.model";
import { IAuthenticationIntentResponseData } from "src/app/domain/interfaces/intent-response/auth.response";

@Injectable({
  providedIn: 'root'
})
export class AuthStore extends Store<AuthenticationState> {

  public constructor() {
    super(new AuthenticationState({}));
  }

  // Get the latest haveToken state
  public get getHaveToken(): boolean {
    return this.state.haveToken;
  }

  // Get the latest authorized state
  public get getAuthorized(): boolean {
    return this.state.authorized;
  }

  // Get the latest authorized user state
  public get getAuthorizedUserData(): IAuthorizedUser {
    return this.state.authorizedUserData;
  }

  // Get the latest authorized user profile
  public get getAuthorizedUserProfile(): User {
    return this.state.authorizedUserData.profile;
  }

  private setAuthenticationRequestState(state: boolean): void {
    this.setState({
      ...this.state,
      authRequestSent: state
    });
  }

  private haveToken(): void {
    this.setState({
      ...this.state,
      haveToken: true
    });
  }

  private authorize(): void {
    this.setState({
      ...this.state,
      authorized: true
    });
  }

  private deauthorize(): void {
    this.setState(
      this.initialState
    );
  }

  private setUserAccessToken(data: IAuthenticationIntentResponseData): void {
    this.setState({
      ...this.state,
      authorizedUserData: {
        ...this.state.authorizedUserData,
        accessToken: data.token.payload,
        expire: data.token.createdAt
      }
    });
  }

  private handleAuthenticationResponse(response: IAuthenticationIntentResponseData): void {
    this.setState({
      ...this.state,
      authResponse: {
        ...this.state.authResponse,
        received: true,
        message: response.descriptionMessage,
        authDenied: response.result === 'Error' ? true : false
        // sessionExpired: response.result === 'Error' && response.refreshTokenUsed ? true : false
      }
    });
  }

  /**
   *
   * @param data : { action }
   */
  public dispatch(data: IAuthStoreInteractAction): void {

    switch (data.action) {

      case 'AUTHENTICATION_REQUEST_SENT':
        this.setAuthenticationRequestState(true);
        break;

      case 'AUTHENTICATION_REQUEST_RECEIVED':
        this.setAuthenticationRequestState(false);
        break;

      case 'AUTHORIZE':
        this.authorize();
        break;

      case 'DEAUTHORIZE':
        this.deauthorize();
        break;

      case 'HAVE_TOKEN':
        this.haveToken();
        break;

      case 'SET_USER_ACCESS_TOKEN':
        this.setUserAccessToken(data.authResponse);
        break;

      case 'SET_AUTH_RESPONSE':
        this.handleAuthenticationResponse(data.authResponse);
        break;

    }

  }
}
