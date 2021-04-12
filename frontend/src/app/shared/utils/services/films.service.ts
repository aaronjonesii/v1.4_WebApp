import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class FilmsService {
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor( private http: HttpClient ) { }

  get_animes(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/frontend/admin/films/animes/`, {headers: this.httpHeaders});
  }
  get_movies(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/frontend/admin/films/movies/`, {headers: this.httpHeaders});
  }
  get_shows(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/frontend/admin/films/shows/`, {headers: this.httpHeaders});
  }

}
