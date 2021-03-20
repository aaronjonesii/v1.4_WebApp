import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'anon-posts-hero',
  templateUrl: './posts-hero.component.html',
  styleUrls: ['./posts-hero.component.scss']
})
export class PostsHeroComponent implements OnInit {
  blog = {
    id: 1,
    date: 'Apr 22',
    readtime: '2',
    title: 'Nebula',
    subtitle: 'One-way template expression binding mechanism in Angular',
    content: 'A nebula is an interstellar cloud of dust, hydrogen, helium and other ionized gases. Originally, nebula was a name for any diffuse astronomical object, including galaxies beyond the Milky Way.',
    author: 'Wikipedia',
    image: 'https://picsum.photos/400/150',
    image2: 'https://picsum.photos/100'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
