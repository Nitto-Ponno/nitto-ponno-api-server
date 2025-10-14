export interface TCategory {
  _id?: string;
  name: string;
  parent_id: string;
  subCategories?: TCategory[];
  isDeleted: Boolean;
  isFeatured: Boolean;
  image: string;
  description?: string;
  slug: string;
}

export interface TUpdateCategory {
  name: string;
  slug: string;
}
