import AddProduct from "@/components/forms/AddProduct";
import { fetchAttributes } from "@/lib/actions/attribute.action";
import { getAllCategories } from "@/lib/actions/category.action";

const page = async () => {
  const categories = await getAllCategories();
  const attributesData = await fetchAttributes();

  return (
    <div>
      <h2 className="head-text py-8">Add Product</h2>

      <AddProduct categories={categories} attributesData={attributesData} />
    </div>
  );
};

export default page;
