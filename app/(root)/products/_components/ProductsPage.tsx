"use client";

import DataTable from "./data-table";
import { columns } from "./columns";

const ProductsPage = ({ products, categories }: { products: any[]; categories: any[] }) => {
  console.log("products", products.length);
  console.log("categories", categories.length);
  console.log("datatable", DataTable);
  console.log("columns", columns);
  return (
    <div className="p-6">
      hola
      {/* <DataTable isLoading={false} columns={columns} data={products || []} categories={categories || []} /> */}
    </div>
  );
};

export default ProductsPage;
