export interface IAttribute {
  id?: string;
  key: string;
  value: string[];
}

export interface ISize {
  id: string;
  type: string;
  value: string[];
}

export interface IColor {
  id: string;
  name: string;
  hex: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  wearType?: string;
  parentId?: string | null;
  children?: ICategory[];
  products?: IProduct[];
  parent?: ICategory;
}

export interface IGroupCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  banner: string;
  isActive: boolean;
  parentId?: string | null;
  parent?: ICategory;
  products: IProduct[];
}

export interface IProduct {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  mrp: number;
  material: string;
  inStock: boolean;
  isNewArrival: boolean;
  isBestSeller?: boolean;
  colors: IColor[];
  genders: string[];

  sizeCategory: string;
  sizes: IProductSize[];
  images: IImageFile[];
  attributes: IProductAttribute[];

  category?: ICategory;
  categoryId: string;
  subCategory?: { id: string; name: string; slug?: string } | string;
}

export interface IImageFile {
  id?: string;
  key: string;
  color: string;
  blob?: string;
  url: string;
  publicId: string;
  productId?: string;
}

export interface IProductSize {
  id?: string;
  key: string;
  value: string;
  quantity: number;
  productId?: string;
}

export interface IProductAttribute {
  id?: string;
  key: string;
  value: string;
  productId?: string;
}
