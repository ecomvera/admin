import ProductDetails from "@/components/shared/ProductDetails";
import { getProductDetails } from "@/lib/actions/product.action";
import React from "react";

const page = async ({ params }: { params: { id: string } }) => {
  const data = await getProductDetails(params.id);

  if (!data) return <div>Product not found</div>;

  return (
    <div>
      <ProductDetails data={data} />
    </div>
  );
};

export default page;
