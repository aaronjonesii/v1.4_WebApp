import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common";
import { environment } from "../../../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class FilmsService {
  httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor( private http: HttpClient ) { }

  get_films(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/frontend/admin/films/`, {headers: this.httpHeaders});
  }

  update_films(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/frontend/admin/films/update/`, {headers: this.httpHeaders});
  }

  get_movies(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/frontend/admin/films/movies/`, {headers: this.httpHeaders});
  }
  get_shows(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/frontend/admin/films/shows/`, {headers: this.httpHeaders});
  }

  load(pageURL: string): Observable<any> {
    return this.http.get<any>(pageURL, {headers: this.httpHeaders});
  }

  search_movies(search_query: string): Observable<any> {
    let url = encodeURI(`${environment.apiURL}/frontend/admin/films/movies/?search=${search_query}`);
    return this.http.get<any>(url, {headers: this.httpHeaders});
  }

}
