export interface Post {
  id?: string;
  author: string;
  tags?: Tag[];
  category?: Category;
  title: string;
  symbol?: string;
  byline?: string;
  background_image?: string;
  slug: string;
  content: string;
  read_time: string;
  updated_on?: string;
  created_on: string;
  publish_on?: string;
  status: number;

}

export interface Tag {
  name: string;
}

export interface Category {
  name: string;
}
