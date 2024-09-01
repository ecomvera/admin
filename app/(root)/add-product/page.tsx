"use client";

import AddProduct from "@/components/forms/AddProduct";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Page = () => {
  const categories = useSWR("/api/categories", fetcher);
  const attributes = useSWR("/api/attributes", fetcher);

  return (
    <div>
      <h2 className="head-text py-8">Add Product</h2>

      <AddProduct
        categories={{ data: categories?.data?.data, isLoading: categories.isLoading }}
        attributesData={{ data: attributes?.data?.data, isLoading: attributes.isLoading }}
      />
    </div>
  );
};

export default Page;
