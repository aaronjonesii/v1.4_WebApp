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
    icon: 'file-text-outline',
    link: '/admin/stories',
    children: [
      { title: 'All Stories', link: '/admin/stories' },
      { title: 'Categories' },
      { title: 'Tags' },
    ]
  },

  { title: 'CRYPTO', group: true },
  { title: 'Crypto LInks', link: 'admin/crypto', icon: 'grid-outline' },
  { title: 'All Crypto Tokens', link: 'admin/crypto/tokens', icon: {icon: 'bitcoin', pack: 'custom-icons'} },
  { title: 'Binance Smart Chain Tokens', link: 'admin/crypto/bsc-tokens', icon: {icon: 'bsc', pack: 'custom-icons'} },
  { title: 'Public Tokens', icon: 'eye-outline' },
  { title: 'Archived Tokens', icon: 'archive-outline', link: 'admin/crypto/archived-tokens' },
  { title: 'Trashed Tokens', icon: 'trash-2-outline', link: 'admin/crypto/trashed-tokens' },

  { title: 'FILMS', group: true},
  { title: 'Anime Shows', link: '/admin/films/animes', icon: {icon: 'video-camera', pack: 'font-awesome'} },
  { title: 'Movies', link: '/admin/films/movies', icon: {icon: 'film', pack: 'font-awesome'} },
  { title: 'TV Shows', link: '/admin/films/shows', icon: 'tv-outline' },
  { title: 'Films Overview', link: '/admin/films', icon: {icon: 'database', pack: 'font-awesome'} },
]
