import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfig } from '../api.config';
import {
  IUserCollectionRequestResponseDescription,
  IUserDescription,
  IUserRequestResponseDescription,
  IVisuUserCollectionRequestResponseDescription,
  UserDescription
} from 'src/app/data/interfaces/descriptions/api/user/description';
import { environment } from 'src/environments/environment';
import {LoggerService} from "src/app/utils/logger.service";

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    private http: HttpClient,
    private apiConfig: ApiConfig,
    private loggerService: LoggerService
  ) { }

  private parseUserCollectionDescription(userCollectionDescription: IUserDescription[]): UserDescription[] {
    return userCollectionDescription.map((description: IUserDescription) => new UserDescription(description));
  }

  private parseUserDescription(userDescription: IUserDescription): UserDescription {
    return new UserDescription(userDescription);
  }

  public getUserCollection(): Observable<IVisuUserCollectionRequestResponseDescription> {

    const userCollectionReqUrl: URL = this.apiConfig.buildApiURL({ urlType: 'User_List' });
    const visuUserCollectionReqUrl: URL = this.apiConfig.buildApiURL({ urlType: 'User_List_FF' });
    const userCollectionReqParams: HttpParams = this.apiConfig.parseRequestParams({}, 'user-collection');

    return this.http.get<IVisuUserCollectionRequestResponseDescription>(visuUserCollectionReqUrl.href)
      .pipe(
        map((response: IVisuUserCollectionRequestResponseDescription) => {

          if (environment.forTestPurpose) {
            this.loggerService.info('Data layer >> Get User collection response: ', response, this.constructor.name)
          }

          response.content = this.parseUserCollectionDescription(response.content);
          return response;
        })
      );
  }

  public getAuthorizedUserProfile(): Observable<IUserRequestResponseDescription> {

    const authUserProfileReqUrl: URL = this.apiConfig.buildApiURL({ urlType: 'Get_Authorized_User_Profile' });

    return this.http.get<IUserRequestResponseDescription>(authUserProfileReqUrl.href)
      .pipe(
        map((response: IUserRequestResponseDescription) => {

          if (environment.forTestPurpose) {
            this.loggerService.info('Data layer >> Get Auth user response: ', response, this.constructor.name)
          }

          response.details = this.parseUserDescription(response.details);
          return response;
        })
      );
  }

  public getUserBySearchData(data: string): void {


  }
}
