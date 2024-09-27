import { fetcher, fetchOpt } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category";
import { useEffect } from "react";
import useSWR from "swr";

export const useCategories = () => {
  const { categories, setCategories } = useCategoryStore();
  const { mutate: fetchCategories, isLoading: fetchCategoriesLoading } = useSWR("/api/categories", fetcher, fetchOpt);

  useEffect(() => {
    const fetch = async () => {
      if (!categories.length) {
        const res = await fetchCategories();
        setCategories(res?.data || []);
      }
    };
    fetch();
  }, []);
  return { categories, fetchCategoriesLoading };
};
