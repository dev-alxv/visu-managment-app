import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthStore } from './presentation/+store/global/auth/auth.store';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authStore: AuthStore,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const returnUrl: string = route['_routerState']['url'];

    if (this.authStore.getAuthorized) {
      return true;
    }

    // navigate to initial page as user is not authenticated (with support for return URL)
    if (returnUrl.endsWith('/edit')) {
      this.router.navigateByUrl(
        this.router.createUrlTree(
          [''], {
          queryParams: {
            returnUrl: returnUrl.replace('/edit', '')
          }
        }
        )
      );
    } else if (false) {

    } else {
      this.router.navigateByUrl(
        this.router.createUrlTree(
          [''], {
          queryParams: {
            returnUrl: returnUrl
          }
        }
        )
      );
    }

    return false;
  }

}
