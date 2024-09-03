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
  images: { key: string; url: string }[];
  category: { _id: string; name: string; slug?: string } | string;
  subCategory: { _id: string; name: string; slug?: string } | string;
  material: string;
  quantity: number;
  sizes: string[];
  attributes: { key: string; value: string }[];
  inStock: boolean;
  isNewArrival: boolean;
}

export interface IAttribute {
  _id: string;
  title: string;
}
