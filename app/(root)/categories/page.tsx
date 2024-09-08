"use client";

import CategoryTabs from "@/components/shared/CategoryTabs";
import ListCatgorires from "@/components/shared/ListCatgorires";
import { fetcher, fetchOpt } from "@/lib/utils";
import useSWR from "swr";
import { useEffect } from "react";
import { useCategoryStore } from "@/stores/category";

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
    <div className="flex flex-col gap-5 tablet:flex-row">
      <div className="w-full">
        <h2 className="head-text py-8">Add Category</h2>
        <CategoryTabs parentCategories={categories || []} isLoading={fetchCategoriesLoading} />
      </div>
      <ListCatgorires isLoading={fetchCategoriesLoading} allCategories={categories || []} />
    </div>
  );
};

export default Page;
