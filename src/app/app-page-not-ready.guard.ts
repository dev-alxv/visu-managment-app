import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthStore } from './presentation/+store/global/auth/auth.store';
import { OrderStore } from './presentation/+store/global/order/order.store';
import { isDefined } from './utils/utils';

@Injectable({
  providedIn: 'root'
})
export class PageNotReadyGuard implements CanActivate {

  constructor(
    private authStore: AuthStore,
    private orderStore: OrderStore,
    private router: Router
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const returnUrl = route['_routerState']['url'];

    if (isDefined(this.orderStore.state.list) && this.orderStore.state.list.length) {
      return true;
    }

    if (this.router.url.includes('/edit')) {
      console.log('AAAAAAAAAAA > ', this.router.url);
    }
    // navigate to initial page as user is not authenticated (with support for return URL)
    // this.router.navigateByUrl(
    //   this.router.createUrlTree(
    //     [''], {
    //     queryParams: {
    //       returnUrl: returnUrl
    //     }
    //   }
    //   )
    // );

    return false;
  }

}
