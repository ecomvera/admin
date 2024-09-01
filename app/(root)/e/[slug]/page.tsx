"use client";

import EditProduct from "@/components/forms/EditProduct";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

const Page = ({ params, searchParams }: { params: { slug: string }; searchParams: any }) => {
  const product = useSWR(`/api/product/${params.slug}`, fetcher);
  const categories = useSWR("/api/categories", fetcher);
  const attributes = useSWR("/api/attributes", fetcher);

  if (product.isLoading) return <div className="text-center text-xl text-light-3">Loading...</div>;

  return (
    <div>
      <h2 className="head-text py-8">Edit Product</h2>

      <EditProduct
        categories={categories?.data?.data || []}
        product={product?.data?.data}
        path={searchParams.path}
        attributesData={attributes?.data?.data || []}
      />
    </div>
  );
};

export default Page;
