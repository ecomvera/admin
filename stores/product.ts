import { IImageFile } from "@/types";
import { create } from "zustand";

const files: IImageFile[] = [];

interface IFiles {
  files: IImageFile[];
  setFiles: (files: IImageFile[]) => void;
  colors: string[];
  setColors: (colors: string[]) => void;
}

export const useFileStore = create<IFiles>((set) => ({
  files: files,
  setFiles: (files) => set({ files: files }),
  colors: [],
  setColors: (colors) => set({ colors: colors }),
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
