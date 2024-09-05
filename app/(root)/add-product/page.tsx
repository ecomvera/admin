"use client";

import AddProduct from "@/components/forms/AddProduct";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

const Page = () => {
  const categories = useSWR("/api/categories", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  const attributes = useSWR("/api/attributes", fetcher);

  return (
    <div>
      <h2 className="head-text py-8">Add Product</h2>

      <AddProduct
        categories={{ data: categories?.data?.data || [], isLoading: categories.isLoading }}
        attributesData={{ data: attributes?.data?.data || [], isLoading: attributes.isLoading }}
      />
    </div>
  );
};

export default Page;
