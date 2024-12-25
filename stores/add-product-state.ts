import { create } from "zustand";

interface IAddProductState {
  formData: typeof formData;
  setFormData: (data: typeof formData) => void;
}

const formData = {
  name: "",
  description: "",
  price: "",
  mrp: "",
  material: "",
  inStock: false,
  isNewArrival: false,
  genders: [],
  sizeCategory: "",
  sizes: [],
  warehouses: [],
  productType: "",
  category: "",
  subCategory: "",
  attributes: [],
};

console.log(formData);
export const addProductState = create<IAddProductState>((set) => ({
  formData: formData,
  setFormData: (data: any) => set({ formData: data }),
}));
