import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'film_image'})
export class FilmImagePipe implements PipeTransform {
  transform(input: any): string {
    let image_url = 'https://www.mymovierack.com/images/title/4/6/9764/orig.jpg';
    if (input !== undefined) {
      const movie_images = JSON.parse(input)
      if ("poster" in movie_images) {
        if (movie_images.poster != undefined) {
          if (movie_images.poster.includes('http')) {
            image_url = movie_images.poster.replace('http', 'https')
          }
        }
      }
    }
    return image_url
  }
}
