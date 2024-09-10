"use client";

import CategoryTabs from "@/components/shared/CategoryTabs";
import ListCatgorires from "@/components/shared/ListCatgorires";
import { fetcher, fetchOpt } from "@/lib/utils";
import useSWR from "swr";
import { useEffect } from "react";
import { useCategoryStore } from "@/stores/category";
// import Attributes from "@/components/shared/Attributes";
// import { useAttributeStore } from "@/stores/attribute";

const Page = () => {
  const { categories, setCategories } = useCategoryStore();
  const { mutate: fetchCategories, isLoading: fetchCategoriesLoading } = useSWR("/api/categories", fetcher, fetchOpt);
  // const { attributes, setAttributes } = useAttributeStore();
  // const { mutate: fetchAttributes, isLoading: fetchAttriburesLoading } = useSWR("/api/attributes", fetcher, fetchOpt);

  useEffect(() => {
    const fetch = async () => {
      if (!categories.length) {
        const res = await fetchCategories();
        setCategories(res?.data || []);
      }
      // if (!attributes.length) {
      //   const res = await fetchAttributes();
      //   setAttributes(res?.data || []);
      // }
    };
    fetch();
  }, []);

  return (
    <div className="flex flex-col gap-5 tablet:flex-row">
      <div className="w-full">
        <h2 className="head-text py-8">Add Category</h2>
        <CategoryTabs parentCategories={categories || []} isLoading={fetchCategoriesLoading} />
        {/* <Attributes attributes={attributes || []} /> */}
      </div>
      <ListCatgorires isLoading={fetchCategoriesLoading} allCategories={categories || []} />
    </div>
  );
};

export default Page;
