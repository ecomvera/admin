"use client";

import ProductDetails from "@/components/shared/ProductDetails";
import { fetcher, fetchOpt } from "@/lib/utils";
import useSWR from "swr";

const Page = ({ params }: { params: { slug: string } }) => {
  const product = useSWR(`/api/products/${params.slug}`, fetcher, {
    ...fetchOpt,
    revalidateOnMount: true,
  });

  if (product.isLoading) return <div className="text-center text-xl text-light-3">Loading...</div>;

  return <ProductDetails data={product?.data?.data} />;
};

export default Page;
