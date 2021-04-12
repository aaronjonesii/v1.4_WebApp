import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Pipe({name: 'film_movie_link'})
export class FilmMovieLinkPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(input: any): SafeUrl {
    let movie_link = '';
    const movie_torrents = JSON.parse(input)
    if ("en" in movie_torrents) {
      if ("1080p" in movie_torrents.en) { movie_link = movie_torrents.en['1080p'].url } else {
        if ("720p" in movie_torrents.en) { movie_link = movie_torrents.en['720p'].url }
      }
    }
    return this.sanitizer.bypassSecurityTrustUrl(movie_link)
  }
}
