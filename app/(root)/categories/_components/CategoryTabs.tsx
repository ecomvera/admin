"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSubCategory from "@/components/forms/AddSubCategory";
import AddCategory from "@/components/forms/AddCategory";
import type { ICategory } from "@/types";
import { FolderPlus, Plus } from "lucide-react";

const CategoryTabs = ({ isLoading, parentCategories }: { isLoading: boolean; parentCategories: ICategory[] }) => {
  const [categoryType, setCategoryType] = useState("sub-category");

  return (
    <Tabs defaultValue={categoryType} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value="sub-category"
          className="flex items-center gap-2"
          onClick={() => setCategoryType("sub-category")}
        >
          <Plus className="h-4 w-4" />
          Sub-Category
        </TabsTrigger>
        <TabsTrigger
          value="parent-category"
          className="flex items-center gap-2"
          onClick={() => setCategoryType("parent-category")}
        >
          <FolderPlus className="h-4 w-4" />
          Parent Category
        </TabsTrigger>
      </TabsList>

      <div className="mt-6">
        <TabsContent value="sub-category" className="mt-0">
          <AddSubCategory parentCategories={parentCategories} isLoading={isLoading} />
        </TabsContent>
        <TabsContent value="parent-category" className="mt-0">
          <AddCategory />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default CategoryTabs;
