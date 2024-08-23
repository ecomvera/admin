"use client";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { products as data } from "@/constants/products";

const page = () => {
  return (
    <div>
      <h2 className="head-text py-8">Products</h2>

      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default page;
