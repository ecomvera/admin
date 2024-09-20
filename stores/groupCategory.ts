import { IGroupCategory } from "@/types";
import { create } from "zustand";

const groupCategories: IGroupCategory[] = [];

interface IGroupCategoryStore {
  groupCategories: IGroupCategory[];
  setGroupCategories: (groupCategory: IGroupCategory[]) => void;
  addGroupCategory: (groupCategory: IGroupCategory) => void;
  updateGroupCategory: (id: string, data: any) => void;
  deleteGroupCategory: (id: string) => void;
}

export const useGroupCategoryStore = create<IGroupCategoryStore>((set) => ({
  groupCategories: groupCategories,
  setGroupCategories: (data: IGroupCategory[]) => set({ groupCategories: data }),
  addGroupCategory: (data: IGroupCategory) => {
    set((state) => {
      state.groupCategories.push(data);
      return { groupCategories: state.groupCategories };
    });
  },
  updateGroupCategory: (id: string, data: any) => {
    set((state) => {
      const index = state.groupCategories.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.groupCategories[index] = { ...state.groupCategories[index], ...data };
        return { groupCategories: state.groupCategories };
      }
      return { groupCategories: state.groupCategories };
    });
  },
  deleteGroupCategory: (id: string) => {
    set((state) => {
      state.groupCategories = state.groupCategories.filter((item) => item.id !== id);
      return { groupCategories: state.groupCategories };
    });
  },
}));
