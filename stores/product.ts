import { create } from "zustand";

const files: { key: string; blob: string; url: string; publicId: string }[] = [];

interface IFiles {
  files: { key: string; blob: string; url: string; publicId: string }[];
  setFiles: (files: { key: string; blob: string; url: string; publicId: string }[]) => void;
}

export const useFileStore = create<IFiles>((set) => ({
  files: files,
  setFiles: (files) => set({ files: files }),
}));

export const product = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  material: "",
  quantity: "",
  inStock: true,
  isNewArrival: false,
};

type IProductSchema = typeof product;

interface IProductStore {
  product: IProductSchema;
  setProduct: (product: IProductSchema) => void;
}

export const useProductStore = create<IProductStore>((set) => ({
  product: product,
  setProduct: (product) => set({ product: product }),
}));
