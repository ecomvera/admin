"use client";

import ProductDetails from "@/components/shared/ProductDetails";
import { fetcher } from "@/lib/utils";
import useSWR from "swr";

const Page = ({ params }: { params: { slug: string } }) => {
  const product = useSWR(`/api/product/${params.slug}`, fetcher);

  if (product.isLoading) return <div className="text-center text-xl text-light-3">Loading...</div>;

  return (
    <div>
      <ProductDetails data={product?.data?.data} />
    </div>
  );
};

export default Page;
