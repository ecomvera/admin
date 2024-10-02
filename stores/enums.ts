import { IAttribute, IColor, ISize } from "@/types";
import { create } from "zustand";

const attributes: IAttribute[] = [];
const sizes: ISize[] = [];
const colors: IColor[] = [];

interface IEnumsStore {
  attributes: IAttribute[];
  setAttributes: (attributes: IAttribute[]) => void;
  addAttributeKey: (attribute: IAttribute) => void;
  addAttributeValue: (key: string, value: string) => void;
  removeAttributeKey: (id: string) => void;
  removeAttributeValue: (id: string, values: string[]) => void;
  updateAttributeKey: (id: string, key: string) => void;

  // sizes
  sizes: ISize[];
  setsizes: (value: ISize[]) => void;
  addSize: (type: string, value: string) => void;
  updateSize: (type: string, values: string[]) => void;

  // colors
  colors: IColor[];
  setColors: (value: IColor[]) => void;
  addColor: (value: IColor) => void;
  removeColor: (value: string) => void;

  // types
  types: string[];
  setTypes: (value: string[]) => void;
  addType: (value: string) => void;
  removeType: (value: string) => void;
}

export const useEnumsStore = create<IEnumsStore>((set) => ({
  attributes: attributes,
  setAttributes: (attributes: IAttribute[]) => set({ attributes }),
  addAttributeKey: (attribute: IAttribute) => set((state) => ({ attributes: [...state.attributes, attribute] })),
  addAttributeValue: (key: string, value: string) =>
    set((state) => ({
      attributes: state.attributes.map((item) => {
        if (item.key === key) {
          return { ...item, value: [...item.value, value] };
        }
        return item;
      }),
    })),
  removeAttributeKey: (id: string) => set((state) => ({ attributes: state.attributes.filter((item) => item.id !== id) })),
  removeAttributeValue: (id: string, values: string[]) =>
    set((state) => {
      const attribute = state.attributes.find((item) => item.id === id);
      if (attribute) attribute.value = values;
      return { attributes: state.attributes };
    }),
  updateAttributeKey: (id: string, key: string) =>
    set((state) => ({ attributes: state.attributes.map((item) => (item.id === id ? { ...item, key } : item)) })),

  // sizes
  sizes: sizes,
  setsizes: (sizes: ISize[]) => set({ sizes }),
  addSize: (type: string, value: string) =>
    set((state) => ({ sizes: state.sizes.map((s) => (s.type === type ? { ...s, value: [...s.value, value] } : s)) })),
  updateSize: (type: string, values: string[]) =>
    set((state) => ({ sizes: state.sizes.map((s) => (s.type === type ? { ...s, value: values } : s)) })),

  // colors
  colors: colors,
  setColors: (colors: IColor[]) => set({ colors }),
  addColor: (data: IColor) => set((state) => ({ colors: [...state.colors, data] })),
  removeColor: (name: string) => set((state) => ({ colors: state.colors.filter((s) => s.name !== name) })),

  // types
  types: [],
  setTypes: (value: string[]) => set({ types: value }),
  addType: (value: string) => set((state) => ({ types: [...state.types, value] })),
  removeType: (value: string) => set((state) => ({ types: state.types.filter((s) => s !== value) })),
}));
