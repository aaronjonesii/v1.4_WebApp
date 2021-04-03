export interface Post {
  id?: string;
  author: string;
  author_name?: string;
  author_nickname?: string;
  tags?: Tag[];
  category?: Category;
  title: string;
  symbol?: string;
  byline?: string;
  background_image?: string;
  slug: string;
  content: string;
  read_time: number;
  updated_on?: string;
  created_on: string;
  publish_on?: string;
  status: number;
  public?: boolean;

}

export interface Tag {
  name: string;
}

export interface Category {
  name: string;
}
