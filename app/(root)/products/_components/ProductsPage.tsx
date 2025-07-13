"use client";

import DataTable from "./data-table";
import { columns } from "./columns";

const ProductsPage = ({ products, categories }: { products: any[]; categories: any[] }) => {
  console.log("columns:", columns);
  console.log("typeof columns[0].cell:", typeof columns[0]?.cell);

  return (
    <div className="p-6">
      <DataTable isLoading={false} columns={columns} data={products || []} categories={categories || []} />
    </div>
  );
};

export default ProductsPage;
