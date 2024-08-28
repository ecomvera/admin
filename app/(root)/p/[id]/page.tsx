"use client";

import ProductDetails from "@/components/shared/ProductDetails";
import { toast } from "@/components/ui/use-toast";
import { getProductDetails } from "@/lib/actions/product.action";
import { IProduct } from "@/types";
import React, { useEffect, useState } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const [data, setData] = useState<IProduct>({} as IProduct);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [data] = await Promise.all([getProductDetails(params.id)]);
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
      <ProductDetails data={data} />
    </div>
  );
};

export default Page;
