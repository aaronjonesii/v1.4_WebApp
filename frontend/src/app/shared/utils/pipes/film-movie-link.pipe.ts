import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

@Pipe({name: 'film_movie_link'})
export class FilmMovieLinkPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(movie_torrents: any): SafeUrl {
    let movie_link = '';
    movie_torrents = movie_torrents.replace(/'/g, "\"")
    if (movie_torrents !== undefined) {
      const json_movie_torrents = JSON.parse(movie_torrents)
      if (json_movie_torrents.hasOwnProperty("en")) {
        if (json_movie_torrents.en.hasOwnProperty("1080p")) { movie_link = json_movie_torrents.en['1080p'].url } else {
          if (json_movie_torrents.en.hasOwnProperty("720p")) { movie_link = json_movie_torrents.en['720p'].url }
        }
      }
    }
    return this.sanitizer.bypassSecurityTrustUrl(movie_link)
  }
}
