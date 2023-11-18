import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { IAuthenticationIntentResponseData } from 'src/app/domain/interfaces/intent-response/auth.response';
import { ApiService } from '../../providers/api/api.service';
import { isDefined } from 'src/app/utils/utils';
import { environment } from 'src/environments/environment';
import { IAuthDescription } from '../../interfaces/descriptions/api/auth/description';
import { IAuthenticationRequest } from 'src/app/domain/interfaces/auth/auth.interfaces';
import { IHttpErr } from '../../providers/interceptors/error.interceptor';
import {LoggerService} from "src/app/utils/logger.service";

@Injectable()
export class AuthenticationRepoService {

  constructor(
    private apiService: ApiService, private loggerService: LoggerService
  ) { }

  public authenticationRequest(authData: IAuthenticationRequest): Observable<IAuthenticationIntentResponseData> {
    return this.parseAuthRequestResponse(this.apiService.getAuthenticationTokenRequest(authData));
  }

  public refreshAccessTokenRequest(oldToken: string): Observable<IAuthenticationIntentResponseData> {
    return this.parseAuthRequestResponse(this.apiService.getRefreshedAuthenticationTokenRequest(oldToken));
  }

  private parseAuthRequestResponse(authResponse: Observable<IAuthDescription>): Observable<IAuthenticationIntentResponseData> {

    return authResponse
      .pipe(
        catchError((err: IHttpErr) => {
          this.loggerService.error('Error', err, this.constructor.name)

          const errorData: IAuthDescription = {
            payload: err.payload,
            // error: err.payload.type,
            errorDescription: err.description
          };
          return of(errorData);
        })
      )
      .pipe(
        map((response: IAuthDescription) => {

          let responseData: IAuthenticationIntentResponseData;

          const errorDesc: boolean = isDefined(response.errorDescription) ? response.errorDescription.startsWith('Invalid refresh token') : false;

          switch (isDefined(response.payload)) {

            case true:
              responseData = {
                result: 'Ok',
                descriptionMessage: 'ACCESS GRANTED',
                token: {
                  ...response.token
                }
              };
              break;

            case false:
              responseData = {
                result: 'Error',
                descriptionMessage: errorDesc ? 'SESSION EXPIRED' : 'ACCESS DENIED',
              };
              break;
          }

          if (environment.forTestPurpose) {
            this.loggerService.info('Data layer >> AuthRequestResponse parsed data: ', responseData, this.constructor.name)
          }

          return responseData;
        })
      );
  }

}
