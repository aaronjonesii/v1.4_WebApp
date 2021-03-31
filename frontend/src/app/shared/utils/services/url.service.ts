import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

@Injectable()
export class UrlService {
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();

  constructor( private router: Router ) { }

  setPreviousUrl(previousUrl: string) {
    this.previousUrl.next(previousUrl);
  }

}
