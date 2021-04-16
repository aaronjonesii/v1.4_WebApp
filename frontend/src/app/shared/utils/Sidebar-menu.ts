import { NbMenuItem } from "@nebular/theme";

export const SIDEBAR_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/admin/dashboard',
    home: true,
  },
  { title: 'BLOG', group: true },
  {
    title: 'Stories',
    icon: 'text-outline',
    link: '/admin/stories',
    children: [
      { title: 'All Stories', link: '/admin/stories' },
      { title: 'Categories', link: '' },
      { title: 'Tags', link: '' },
    ]
  },
  { title: 'Media', icon: 'image-outline' },
  {
    title: 'Films',
    icon: 'film-outline',
    link: '/admin/films/movies',
    children: [
      { title: 'Anime Shows', link: '/admin/films/animes' },
      { title: 'Movies', link: '/admin/films/movies' },
      { title: 'TV Shows', link: '/admin/films/shows' },
    ]
  },
]
