export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  wearType?: string;
  parentId: string | null;
  children?: ICategory[];
  products?: IProduct[];
}

export interface IProduct {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  category: { _id: string; name: string; slug?: string } | string;
  subCategory: { _id: string; name: string; slug?: string } | string;
  images: { key: String; color: String; url: String; publicId: String }[];
  sizes: { key: string; value: string }[];
  attributes: { key: string; value: string }[];
  material: string;
  quantity: number;
  inStock: boolean;
  isNewArrival: boolean;
}

export interface IAttribute {
  _id: string;
  title: string;
}

export interface IImageFile {
  key: string;
  color: string;
  blob: string;
  url: string;
  publicId: string;
}
