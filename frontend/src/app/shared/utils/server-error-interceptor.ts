import { Injectable, Injector } from "@angular/core";
import { AuthClientConfig, AuthHttpInterceptor, AuthService } from "@auth0/auth0-angular";
import {  HttpEvent, HttpHandler, HttpRequest } from "@angular/common/http";
import { catchError, mergeMap, retry } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { ExtrasService } from "./services/extras.service";
import { Router } from "@angular/router";


@Injectable()
export class ServerErrorInterceptor extends AuthHttpInterceptor {
  constructor(
    configFactory: AuthClientConfig,
    authService: AuthService,
    private AuthService: AuthService,
    private extras: ExtrasService,
    private router: Router,
  ) {
    super(configFactory, authService);
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.AuthService.getAccessTokenSilently().pipe(
      mergeMap(() => super.intercept(req, next)),
      retry(1),
      catchError((error:any) => {
        if (error.status === 0) {
          this.extras.showToast('Sorry, unable to connect to the server. Try again later...', 'Unable to connect to server', 'danger', 0);
          this.router.navigateByUrl('/error')
        } else {
          this.extras.showError(`If you are seeing, this please send screenshot to anonsys@protonmail.com`, 'Uncaught Exception');
          console.log(error);
        }
        return throwError(error)
      })
    );
  }
  
}
