"use client";

import AddProduct from "@/components/forms/AddProduct";
import { fetcher, fetchOpt } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category";
import { useEffect } from "react";
import useSWR from "swr";

const Page = () => {
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

  return (
    <div>
      <h2 className="head-text py-8">Add Product</h2>

      <AddProduct categories={{ data: categories, isLoading: fetchCategoriesLoading }} />
    </div>
  );
};

export default Page;
