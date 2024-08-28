"use client";

import { getProducts } from "@/lib/actions/product.action";
import { columns } from "./columns";
import DataTable from "./data-table";
import { getAllCategories } from "@/lib/actions/category.action";
import { useEffect, useState } from "react";
import { ICategory, IProduct } from "@/types";
import { toast } from "@/components/ui/use-toast";

const Page = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [products, categories] = await Promise.all([getProducts(), getAllCategories()]);
        setProducts(products);
        setCategories(categories);
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to fetch categories and attributes",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="head-text py-8">Products</h2>

      <DataTable isLoading={isLoading} columns={columns} data={products} categories={categories} />
    </div>
  );
};

export default Page;
