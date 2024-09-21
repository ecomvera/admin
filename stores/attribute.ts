import { IAttribute, IKeyValue } from "@/types";
import { create } from "zustand";

const attributes: IAttribute[] = [];

interface IAttributeStore {
  attributes: IAttribute[];
  setAttributes: (attributes: IAttribute[]) => void;
  addAttributeKey: (attribute: IAttribute) => void;
  addAttributeValue: (key: string, value: string) => void;
  removeAttributeKey: (id: string) => void;
  removeAttributeValue: (id: string, values: string[]) => void;
  updateAttributeKey: (id: string, key: string) => void;
}

export const useAttributeStore = create<IAttributeStore>((set) => ({
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
}));
