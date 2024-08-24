export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  parentId: string | null;
  children?: ICategory[];
  products?: IProduct[];
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  quantity: number;
  inStock: boolean;
  isNewArrival: boolean;
}
