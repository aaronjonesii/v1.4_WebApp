import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from "rxjs";
import { FilmsService } from "../../../../shared/utils/services/films.service";
import { takeUntil } from "rxjs/operators";
import { FilmResponse, Anime } from "../../../../shared/utils/models/films";

@Component({
  selector: 'anon-admin-films-animes',
  templateUrl: './admin-films-animes.component.html',
  styleUrls: ['./admin-films-animes.component.scss']
})
export class AdminFilmsAnimesComponent implements OnInit, OnDestroy {
  private unsub$: Subject<any> = new Subject<any>();
  animes_loaded = false;
  animes_count = 0;
  animes_next_page = '';
  animes_previous_page = '';
  animes_results: Anime[] = [];

  constructor(
    private filmsService: FilmsService,
  ) {
    this.filmsService.get_animes().pipe(takeUntil(this.unsub$)).subscribe(
      (response: FilmResponse) => {
        this.animes_count = response.count;
        this.animes_next_page = response.next;
        this.animes_previous_page = response.previous;
        this.animes_results = response.results;
      },
      console.error,
      () => {this.animes_loaded = true;}
    );
  }

  ngOnInit() {}
  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }

}
