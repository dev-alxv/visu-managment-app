import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {ApiConfig} from '../api/api.config';
import {
  IAuthDescription,
  IAuthResponseData
} from '../../interfaces/descriptions/api/auth/description';
import {IAuthenticationRequest} from 'src/app/domain/interfaces/auth/auth.interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  // TODO:
  // hardcoded credentials
  // private readonly base64Credential: string = 'aXZheWxvLmFsZWtzaWV2QGltbW92aWV3ZXIuY29tOmZSZ1E3SG9T';
  private base64Credential: string;
  private readonly accessToken = '';
  private readonly user = '';
  private readonly password = '';

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig
  ) { }

  private parseAuthResponse(response: IAuthResponseData, rToken?: boolean): IAuthDescription {

    const descriptionData: IAuthDescription = {
      payload: response,
      token: {
        payload: response.details.encodedToken,
        createdAt: new Date(response.details.createdAt).toISOString(),
        state: response.details.state,
        type: response.details.type
      }
    } as IAuthDescription;

    return descriptionData;
  }

  public obtainAccessToken(authData: IAuthenticationRequest): Observable<IAuthDescription> {

    this.base64Credential = btoa(authData.username + ':' + authData.password);

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${this.base64Credential}`
      })
    };

    const requestData = new FormData();

    requestData.append('identity', this.user);
    requestData.append('password', this.password);

    const accessTokenReqUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Get_Authentication_Token' });

    return this.http.get<IAuthResponseData>(accessTokenReqUrl.href, httpOptions)
      .pipe(
        map(
          (resp: IAuthResponseData) => this.parseAuthResponse(resp)
        )
      );
  }

  public obtainRefreshAccessToken(oldToken: string): Observable<IAuthDescription> {

    let httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${this.base64Credential}`
      })
    };

    const accessTokenReqUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Get_Authentication_Token' });

    return this.http.get<IAuthResponseData>(accessTokenReqUrl.href, httpOptions)
      .pipe(
        map(
          (resp: IAuthResponseData) => this.parseAuthResponse(resp)
        )
      );
  }

}
