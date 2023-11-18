import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationRepo } from '../repository/auth.repo';
import { IAuthenticationIntentResponseData } from '../interfaces/intent-response/auth.response';
import { IAuthenticationRequest } from '../interfaces/auth/auth.interfaces';

@Injectable()
export class AuthenticationManager {

  constructor(
    private authRepo: AuthenticationRepo
  ) { }

  public authenticationRequest(authData: IAuthenticationRequest): Observable<IAuthenticationIntentResponseData> {
    return this.authRepo.authenticationRequest(authData);
  }

  public refreshAccessTokenRequest(oldToken: string): Observable<IAuthenticationIntentResponseData> {
    return this.authRepo.refreshAccessTokenRequest(oldToken);
  }

}
