export interface ICourier {
  platform: string;
  courier_id: string;
  courier_name: string;
  courier_charge: number;
  is_surface: boolean;
  zone: string;
  deliveryTime: string;
  deliveryDate: string;
}

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

export interface IWarehouse {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  products: IProduct[];
}

export interface ICollection {
  id: string;
  name: string;
  slug: string;
  image: string;
  banner: string;
  isActive: boolean;
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
  weight: number;
  hasDeliveryFee: boolean;
  inStock: boolean;
  isNewArrival: boolean;
  isBestSeller?: boolean;
  colors: IColor[];
  genders: string[];
  warehouses: {
    id: string;
    quantity: number;
    name: string;
  }[];
  productType: string;
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
  index: number;
  id?: string;
  key: string;
  value: string;
  quantity: number;
  productColor: string;
  productId?: string;
}

export interface IProductAttribute {
  id?: string;
  key: string;
  value: string;
  productId?: string;
}

export interface IOrderItem {
  id: string;
  orderId: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  totalPrice: number;
}
