"use client";

import { columns } from "./columns";
import DataTable from "./data-table";
// import { fetcher } from "@/lib/utils";
// import useSWR from "swr";

const Page = () => {
  // const categories = useSWR("/api/categories", fetcher);
  // const products = useSWR("/api/product?table-data", fetcher);

  return (
    <div>
      <h2 className="head-text py-8">Products</h2>

      <DataTable isLoading={false} columns={columns} data={[]} categories={[]} />
    </div>
  );
};

export default Page;
