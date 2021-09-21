import { Injectable } from "@angular/core";
import { HttpHeaders } from "@angular/common";



@Injectable({
  providedIn: 'root'
})
export class AdminService {
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor() {}

  /**
  * Checks for the frontend_admin role in the users given ID Token Claims
   * Param: auth.idTokenClaims$
   * Returns: Boolean
   */
  is_frontend_admin(idTokenClaims: any): boolean {
    if (idTokenClaims != null || undefined) {
      if ("https://anonsys.tech/app_metadata" in idTokenClaims) {
        if ("roles" in idTokenClaims["https://anonsys.tech/app_metadata"]) {
          if (idTokenClaims["https://anonsys.tech/app_metadata"]["roles"].includes("frontend_admin")) {
            return true;
          } else {return false}
        } else {return false}
      } else {return false}
    } else {return false}
  }

}
