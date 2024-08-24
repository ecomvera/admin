import EditProduct from "@/components/forms/EditProduct";
import { fetchAttributes } from "@/lib/actions/attribute.action";
import { getAllCategories } from "@/lib/actions/category.action";
import { getProductDetails } from "@/lib/actions/product.action";
import React from "react";

const page = async ({ params, searchParams }: { params: { id: string }; searchParams: any }) => {
  const categories = await getAllCategories();
  const attributesData = await fetchAttributes();
  const data = await getProductDetails(params.id);

  if (!data) return <div>Product not found</div>;

  return (
    <div>
      <h2 className="head-text py-8">Edit Product</h2>

      <EditProduct categories={categories} product={data} path={searchParams.path} attributesData={attributesData} />
    </div>
  );
};

export default page;
