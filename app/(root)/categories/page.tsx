"use client";

import CategoryTabs from "@/components/shared/CategoryTabs";
import Attributes from "@/components/shared/Attributes";
import ListCatgorires from "@/components/shared/ListCatgorires";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

const Page = () => {
  const categories = useSWR("/api/categories", fetcher);
  const attributes = useSWR("/api/attributes", fetcher);
  const parentCategories = useSWR("/api/categories?no-children", fetcher);

  return (
    <div className="flex flex-col gap-5 tablet:flex-row">
      <div className="w-full">
        <h2 className="head-text py-8">Add Category</h2>
        <CategoryTabs parentCategories={parentCategories?.data?.data || []} isLoading={parentCategories.isLoading} />
        <Attributes attributes={attributes?.data?.data || []} />
      </div>
      <ListCatgorires isLoading={categories.isLoading} allCategories={categories?.data?.data || []} />
    </div>
  );
};

export default Page;
