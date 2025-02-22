"use client";

import { useCategoryStore } from "@/stores/category";
import { fetcher, fetchOpt } from "@/lib/utils";
import useSWR from "swr";
import { useEffect } from "react";
import { useProductStore } from "@/stores/product";
// import DataTable from "./data-table";
import { columns } from "./columns";

const ProductsPage = ({ products, categories }: { products: any[]; categories: any[] }) => {
  // const { categories, setCategories } = useCategoryStore();
  // const { products, setProducts } = useProductStore();
  // const { mutate: fetchCategories, isLoading: fetchCategoriesLoading } = useSWR("/api/categories", fetcher, fetchOpt);
  // const { mutate: fetchProducts, isLoading: fetchProductsLoading } = useSWR("/api/products?table-data", fetcher, fetchOpt);

  // useEffect(() => {
  //   const fetch = async () => {
  //     if (!categories.length) {
  //       const res = await fetchCategories();
  //       setCategories(res?.data || []);
  //     }

  //     if (!products.length) {
  //       const res = await fetchProducts();
  //       setProducts(res?.data || []);
  //     }
  //   };
  //   fetch();
  // }, []);

  return (
    <div>
      {/* <DataTable
        // isLoading={fetchCategoriesLoading || fetchProductsLoading}
        isLoading={false}
        columns={columns}
        data={products || []}
        categories={categories || []}
      /> */}
    </div>
  );
};

export default ProductsPage;
