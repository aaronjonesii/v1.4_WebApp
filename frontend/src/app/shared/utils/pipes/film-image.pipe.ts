import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'film_image'})
export class FilmImagePipe implements PipeTransform {
  transform(movie_images: any): string {
    let image_url = 'https://www.mymovierack.com/images/title/4/6/9764/orig.jpg';
    movie_images = movie_images.replace(/'/g, "\"")
    if (movie_images !== undefined) {
      const json_movie_images = JSON.parse(movie_images)
      if (json_movie_images.hasOwnProperty("poster")) {
        if (json_movie_images.poster != undefined) {
          if (json_movie_images.poster.includes('http')) {
            image_url = json_movie_images.poster.replace('http', 'https')
          }
        }
      }
    }
    return image_url
  }
}
