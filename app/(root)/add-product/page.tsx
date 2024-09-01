"use client";

import AddProduct from "@/components/forms/AddProduct";
// import { fetcher } from "@/lib/utils";
// import useSWR from "swr";

const Page = () => {
  // const categories = useSWR("/api/categories", fetcher);
  // const attributes = useSWR("/api/attributes", fetcher);

  return (
    <div>
      <h2 className="head-text py-8">Add Product</h2>

      <AddProduct categories={{ data: [], isLoading: false }} attributesData={{ data: [], isLoading: false }} />
    </div>
  );
};

export default Page;

// const categories = useSWR("/api/categories", fetcher, {
//   revalidateOnFocus: false, // Disable revalidation on focus
//   dedupingInterval: 60000, // Reuse cache for 60 seconds
// });
