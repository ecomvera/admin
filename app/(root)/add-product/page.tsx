import AddProduct from "@/components/forms/AddProduct";
import { getAllCategories } from "@/lib/actions/category.action";

const page = async () => {
  const categories = await getAllCategories();

  return (
    <div>
      <h2 className="head-text py-8">Add Product</h2>

      <AddProduct categories={categories} />
    </div>
  );
};

export default page;
