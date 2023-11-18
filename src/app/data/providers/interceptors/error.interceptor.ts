import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { apiConfig } from 'src/environments/environment';

export interface IHttpErr {
  errorObj: any;
  type: any;
  description: any;
  payload: any;
  status: number;
  statusText: string;
}

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private readonly errorPayload$: BehaviorSubject<{}>;
  public readonly errorPayloadStream$: Observable<{}>;

  constructor(
  ) {
    this.errorPayload$ = new BehaviorSubject({});
    this.errorPayloadStream$ = this.errorPayload$.asObservable();
  }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(request)
      .pipe(
        catchError((err: HttpErrorResponse) => {

          const error: IHttpErr = {
            errorObj: err,
            type: err.type,
            description: err.message,
            payload: err.error,
            status: err.status,
            statusText: err.statusText
          };

          // Can't perform operation due to misconfiguration || Could not find a related resource in the database
          if (err.status === 400 || err.status === 404) {
            this.errorPayload$.next(error.payload);
          }

          // Unauthorized
          if (err.status === 401) {
            // redirect to login page if 401 response returned from api
            // window.location.href = ``;
          }

          if (err.status === 403) {

          }

          if (err.status === 0) {
            console.log('SERVER NOT RESPONDING');
          }

          return throwError(error);
        }));
  }
}
