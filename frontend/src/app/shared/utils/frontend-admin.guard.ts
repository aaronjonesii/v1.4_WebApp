import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot, Router
} from '@angular/router';
import { AuthService } from "@auth0/auth0-angular";
import { map, tap } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { AdminService } from "./services/admin.service";


@Injectable()
export class FrontendAdminGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private admin: AdminService,
    private router: Router,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.redirectIfNotFrontendAdmin(state);
  }

  /**
   * Checks if user is authenticated from auth.idTokenClaims$
   * then checks if user has frontend_admin role from ID Token Claims
   * if false for either, will redirect to to the users last visited url
   * Param: RouterStateSnapshot
   */
  private redirectIfNotFrontendAdmin(state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.idTokenClaims$.pipe(
      map((idTokenClaims) => this.admin.is_frontend_admin(idTokenClaims)),
      tap((is_frontend_admin) => {
        if (!is_frontend_admin) {
          // return this.auth.loginWithRedirect({ appState: { target: state.url } } );
          return this.router.navigateByUrl('/error/404');
        } else { return of(is_frontend_admin) }
      })
    )
  }

}
