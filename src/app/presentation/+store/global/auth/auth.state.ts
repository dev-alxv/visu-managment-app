import { AuthResponse, IAuthorizedUser } from "src/app/domain/interfaces/auth/auth.interfaces";

export class AuthenticationState {

  constructor(
    public authorizedUserData: IAuthorizedUser,
    public haveToken?: boolean,
    public authorized?: boolean,
    public authResponse?: AuthResponse,
    public authRequestSent?: boolean
  ) {
    this.haveToken = false;
    this.authorized = false;
    this.authRequestSent = false;

    // init AuthResponse
    this.authResponse = {
      message: '',
      received: false,
      authDenied: false
    };

    // init AuthorizedUser
    this.authorizedUserData = {
      accessToken: undefined,
      expire: undefined,
      profile: undefined
    };

  }
}
