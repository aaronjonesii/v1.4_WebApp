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
      { title: 'Categories' },
      { title: 'Tags' },
    ]
  },

  { title: 'CRYPTO', group: true },
  { title: 'Binance Smart Chain Tokens', link: 'admin/crypto/' },
  // { title: 'Cryptocurrency Watchlist' },
  // { title: 'Wallet Watchlist' },

  { title: 'FILMS', group: true},
  { title: 'Anime Shows', link: '/admin/films/animes' },
  { title: 'Movies', link: '/admin/films/movies' },
  { title: 'TV Shows', link: '/admin/films/shows' },
  { title: 'Update Database', link: '/admin/films' },
]
