"use client";

import EditProduct from "@/components/forms/EditProduct";
import { fetcher, fetchOpt } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category";
import { useEffect } from "react";
import useSWR from "swr";

const EditProductPage = ({ params, searchParams }: { params: { slug: string }; searchParams: any }) => {
  const product = useSWR(`/api/products/${params.slug}`, fetcher, fetchOpt);
  const { mutate: fetchCategories, isLoading: fetchCategoriesLoading } = useSWR("/api/categories", fetcher, fetchOpt);
  const { categories, setCategories } = useCategoryStore();

  useEffect(() => {
    const fetch = async () => {
      if (!categories.length) {
        const res = await fetchCategories();
        setCategories(res?.data || []);
      }
    };
    fetch();
  }, []);

  if (product.isLoading) return <div className="text-center text-xl text-light-3">Loading...</div>;

  return (
    <>
      <EditProduct categories={categories || []} product={product?.data?.data} path={searchParams.path} />
    </>
  );
};

export default EditProductPage;
