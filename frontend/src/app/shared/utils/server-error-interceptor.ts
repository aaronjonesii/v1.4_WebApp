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
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return super.intercept(req, next).pipe(
      retry(1),
      catchError((error:any) => {
        if (error.status === 0) {
          // TODO: Change once backend is up and ready for production
          this.extras.showToast('Sorry, we are currently working on our backend at the moment. Try again later...', 'Backend is down', 'danger', 0);
          this.router.navigateByUrl('/error')
        } else {
          if (error.message === 'Login required') {
            if (this.authenticated) {
              this.extras.showToast('Sorry, something went wrong authenticating your account. Try again...', 'Error Authenticating', 'danger', 0);
            } console.log('[!] Not authenticated and login required [!]');
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
