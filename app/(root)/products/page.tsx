"use client";

import { columns } from "./columns";
import DataTable from "./data-table";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

const Page = () => {
  const categories = useSWR("/api/categories", fetcher);
  const products = useSWR("/api/product?table-data&no-children", fetcher);

  return (
    <div>
      <h2 className="head-text py-8">Products</h2>

      <DataTable
        isLoading={categories.isLoading || products.isLoading}
        columns={columns}
        data={products?.data?.data || []}
        categories={categories?.data?.data || []}
      />
    </div>
  );
};

export default Page;
