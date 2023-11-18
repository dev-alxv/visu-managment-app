import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { isDefined } from 'src/app/utils/utils';
import { AuthStore } from 'src/app/presentation/+store/global/auth/auth.store';
import { environment } from 'src/environments/environment';
import {LoggerService} from "src/app/utils/logger.service";

@Injectable({
  providedIn: 'root'
})
export class HttpInterceptorService implements HttpInterceptor {

  constructor(
    private authStore: AuthStore, private loggerService: LoggerService
  ) {}

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const authData = this.authStore.getAuthorizedUserData;

    if (isDefined(authData) && isDefined(authData.accessToken)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authData.accessToken}`
        }
      });
    }

    if (environment.forTestPurpose) {
      this.loggerService.info( `INTERCEPT HTTP >>  `, request, this.constructor.name)
    }

    return timer(500) // <== Wait
      .pipe(
        switchMap( // <== Switch to the Http Stream
          () => next.handle(request)
        )
      );
  }
}
