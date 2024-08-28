"use client";

import AddProduct from "@/components/forms/AddProduct";
import { toast } from "@/components/ui/use-toast";
import { fetchAttributes } from "@/lib/actions/attribute.action";
import { getAllCategories } from "@/lib/actions/category.action";
import { IAttribute, ICategory } from "@/types";
import { useEffect, useState } from "react";

const Page = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [attributesData, setAttributesData] = useState<IAttribute[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, attributesData] = await Promise.all([getAllCategories(), fetchAttributes()]);
        setCategories(categoriesData);
        setAttributesData(attributesData);
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to fetch categories and attributes",
        });
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="head-text py-8">Add Product</h2>

      <AddProduct categories={categories} attributesData={attributesData} />
    </div>
  );
};

export default Page;
