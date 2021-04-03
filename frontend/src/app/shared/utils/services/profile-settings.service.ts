import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProfileSettingsService {
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(
    private http: HttpClient,
  ) { }

  updateAuth0User(user_update: object): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/user/update/`, user_update, {headers: this.httpHeaders});
  }

}
