import { NbMenuItem } from "@nebular/theme";

export const SIDEBAR_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/admin/dashboard',
    home: true,
  },
  { title: 'BLOG', group: true },
  { title: 'Stories', icon: 'file-text-outline', link: 'admin/stories' },
  // {
  //   title: 'Stories',
  //   icon: 'file-text-outline',
  //   link: '/admin/stories',
  //   children: [
  //     { title: 'All Stories', link: '/admin/stories' },
  //     { title: 'Categories' },
  //     { title: 'Tags' },
  //   ]
  // },

  { title: 'CRYPTOCURRENCY', group: true },
  { title: 'Dashboard', link: '/admin/crypto', icon: {icon: 'grip-horizontal', pack: 'new-font-awesome'} },
  { title: 'Tokens', icon: {icon: 'bitcoin', pack: 'custom-icons'}, children: [
      { title: 'All Crypto Tokens', link: 'admin/crypto/tokens' },
      { title: 'Binance Smart Chain Tokens', link: 'admin/crypto/bsc-tokens' },
      // { title: 'Public Tokens' },
      { title: 'Hidden', children: [
          { title: 'Archived Tokens', link: 'admin/crypto/archived-tokens' },
          { title: 'Trashed Tokens', link: 'admin/crypto/trashed-tokens' },
        ] },
    ] },
  { title: 'Wallets', icon: {icon: 'wallet', pack: 'new-font-awesome'}, children: [
      { title: 'Dashboard', link: 'admin/crypto/wallets/dashboard' },
      { title: 'All Wallets', link: 'admin/crypto/wallets' },
      { title: 'Hidden', children: [
          { title: 'Archived Wallets' },
          { title: 'Trashed Wallets' },
        ] },
    ] },

  { title: 'FILMS', group: true},
  { title: 'Anime Shows', link: '/admin/films/animes', icon: {icon: 'video-camera', pack: 'font-awesome'} },
  { title: 'Movies', link: '/admin/films/movies', icon: {icon: 'film', pack: 'font-awesome'} },
  { title: 'TV Shows', link: '/admin/films/shows', icon: 'tv-outline' },
  { title: 'Films Overview', link: '/admin/films', icon: {icon: 'database', pack: 'font-awesome'} },
]
