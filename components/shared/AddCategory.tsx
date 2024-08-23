"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddSubCategory from "../forms/AddSubCategory";
import AddParentCategory from "../forms/AddParentCategory";

interface Props {}

const AddCategory = ({}: Props) => {
  const [categoryType, setCategoryType] = useState("sub-category");

  return (
    <Tabs defaultValue={categoryType} className="">
      <TabsList className="w-full">
        <TabsTrigger value="sub-category" className="w-full" onClick={() => setCategoryType("sub-category")}>
          Sub-Category
        </TabsTrigger>
        <TabsTrigger value="parent-category" className="w-full" onClick={() => setCategoryType("parent-category")}>
          Parent Category
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sub-category">
        <AddSubCategory />
      </TabsContent>
      <TabsContent value="parent-category">
        <AddParentCategory />
      </TabsContent>
    </Tabs>
  );
};

export default AddCategory;
