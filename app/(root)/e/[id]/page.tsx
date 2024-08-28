"use client";

import EditProduct from "@/components/forms/EditProduct";
import { toast } from "@/components/ui/use-toast";
import { fetchAttributes } from "@/lib/actions/attribute.action";
import { getAllCategories } from "@/lib/actions/category.action";
import { getProductDetails } from "@/lib/actions/product.action";
import { IAttribute, ICategory, IProduct } from "@/types";
import React, { useEffect, useState } from "react";

const page = ({ params, searchParams }: { params: { id: string }; searchParams: any }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [attributesData, setAttributesData] = useState<IAttribute[]>([]);
  const [data, setData] = useState<IProduct>({} as IProduct);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categories, attributesData, data] = await Promise.all([
          getAllCategories(),
          fetchAttributes(),
          getProductDetails(params.id),
        ]);
        setCategories(categories);
        setAttributesData(attributesData);
        setData(data);
      } catch (error) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to fetch categories and attributes",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="text-center text-xl text-light-3">Loading...</div>;
  if (!loading && !data) return <div>Product not found</div>;

  return (
    <div>
      <h2 className="head-text py-8">Edit Product</h2>

      <EditProduct categories={categories} product={data} path={searchParams.path} attributesData={attributesData} />
    </div>
  );
};

export default page;
