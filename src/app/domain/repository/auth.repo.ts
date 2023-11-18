import { Observable } from 'rxjs';

import { IAuthenticationIntentResponseData } from '../interfaces/intent-response/auth.response';
import { IAuthenticationRequest } from '../interfaces/auth/auth.interfaces';

export abstract class AuthenticationRepo {

  public abstract authenticationRequest(authData: IAuthenticationRequest): Observable<IAuthenticationIntentResponseData>;
  public abstract refreshAccessTokenRequest(token: string): Observable<IAuthenticationIntentResponseData>;
}
