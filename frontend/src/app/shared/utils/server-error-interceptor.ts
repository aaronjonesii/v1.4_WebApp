import { Injectable, Injector } from "@angular/core";
import { AuthClientConfig, AuthHttpInterceptor, AuthService } from "@auth0/auth0-angular";
import {  HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { catchError, mergeMap, retry } from "rxjs/operators";
import { Observable, of, throwError } from "rxjs";
import { ExtrasService } from "./services/extras.service";
import { Router } from "@angular/router";


@Injectable()
export class ServerErrorInterceptor extends AuthHttpInterceptor {
  authenticated: any;
  constructor(
    configFactory: AuthClientConfig,
    authService: AuthService,
    private _authService: AuthService,
    private extras: ExtrasService,
    private router: Router,
  ) {
    super(configFactory, authService);
    this._authService.isAuthenticated$.subscribe(isAuthenticated => this.authenticated = isAuthenticated)
  }

  // intercept(
  //   req: HttpRequest<any>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<any>> {
  //   return this._authService.getAccessTokenSilently().pipe(
  //     catchError(() => of(true)),
  //     // getAccessTokenSilently returns a string
  //     // if the value of errorOccurred is a boolean true, then an error has occured and the request continues without an authorization header
  //     mergeMap(errorOccurred => errorOccurred === true ?
  //       next.handle(req)
  //       : super.intercept(req, next)),
  //   );
  // }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this._authService.getAccessTokenSilently().pipe(
      mergeMap(() => super.intercept(req, next)),
      retry(1),
      catchError((error:any) => {
        if (error.status === 0) {
          this.extras.showToast('Sorry, unable to connect to the server. Try again later...', 'Unable to connect to server', 'danger', 0);
          this.router.navigateByUrl('/error')
        } else {
          if (error.message === 'Login required') {
            if (this.authenticated) {
              this.extras.showToast('Sorry, something went wrong authenticating your account. Try again...', 'Error Authenticating', 'danger', 0);
            }
          } else {
            this.extras.showError(`If you are seeing, this please send screenshot to anonsys@protonmail.com`, 'Uncaught Exception');
            console.log(error);
          }
        }
        return throwError(error)
      })
    );
  }

}
