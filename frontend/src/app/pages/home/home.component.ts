import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from "@auth0/auth0-angular";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  tags = [
    'Technology',
    'Future',
    'Health',
    'Science',
    'Business',
    'Work',
    'Culture',
    'Programming',
    'Design',
    'Productivity',
    'Cryptocurrency',
    'Artificial Intelligence',
    'Computers',
    'Operating Systems'
  ];

  constructor(
    public auth: AuthService,
  ) { }

  ngOnInit() { }

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
