import { Injectable, Inject } from '@angular/core';
import { Router, CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { CookieService } from './shared/service/cookie.service';

 @Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
  private url: Array<string>;
  private token = this.cookieService.get('token');
  private canActivateChildPage: Array<string>;

  constructor(
    private _router: Router,
    private cookieService: CookieService,
  ) { }

  private removeUrlParams(url: string) {
    if (url.indexOf(';') > -1) {
      const semicolon = url.indexOf(';'),
        slash = url.indexOf('/', semicolon),
        removeMatrixParam = url.replace(url.slice(semicolon, slash), '');
      return this.removeUrlParams(removeMatrixParam);
    } else if (url.indexOf('?') > -1) {
      const questionMark = url.indexOf('?'),
        removeQueryParam = url.replace(url.slice(questionMark), '');
      return removeQueryParam;
    } else {
      return url;
    }
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const path = route.url[0].path;
    if (this.token && path === 'login') {
      this._router.navigate(['/home']);
      return false;
    } else if (!this.token && path != 'login') {
      this._router.navigate(['./login']);
      return false;
    }
    return true;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = this.removeUrlParams(state.url);
    this.url = url.split('/');

    if (this.token && this.url[2] && this.canActivateChildPage.indexOf(this.url[2]) === -1) {
      // console.log('權限不足，無法訪問該功能.');
      return false;
    }
    return true;
  }
}
