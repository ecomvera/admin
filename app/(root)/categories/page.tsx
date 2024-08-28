"use client";

import CategoryTabs from "@/components/shared/CategoryTabs";
import Attributes from "@/components/shared/Attributes";
import ListCatgorires from "@/components/shared/ListCatgorires";
import { fetchAttributes } from "@/lib/actions/attribute.action";
import { getAllCategories, getParentCategories } from "@/lib/actions/category.action";
import { useEffect, useState } from "react";
import { IAttribute, ICategory } from "@/types";
import { toast } from "@/components/ui/use-toast";

const Page = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [parentCategories, setParentCategories] = useState<ICategory[]>([]);
  const [attributesData, setAttributesData] = useState<IAttribute[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [attributes, parentCategoriesDB, allCategories] = await Promise.all([
          fetchAttributes(),
          getParentCategories(),
          getAllCategories(),
        ]);

        setCategories(allCategories);
        setParentCategories(parentCategoriesDB);
        setAttributesData(attributes);
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to fetch data from server",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-5 tablet:flex-row">
      <div className="w-full">
        <h2 className="head-text py-8">Add Category</h2>
        <CategoryTabs parentCategories={parentCategories} />

        <Attributes attributes={attributesData} />
      </div>

      <ListCatgorires isLoading={isLoading} allCategories={categories} />
    </div>
  );
};

export default Page;
