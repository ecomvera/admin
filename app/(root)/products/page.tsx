import { getProducts } from "@/lib/actions/product.action";
import { columns } from "./columns";
import DataTable from "./data-table";
import { products as data } from "@/constants/products";
import { getAllCategories } from "@/lib/actions/category.action";

const page = async () => {
  const products = await getProducts();
  const categories = await getAllCategories();

  return (
    <div>
      <h2 className="head-text py-8">Products</h2>

      <DataTable columns={columns} data={products} categories={categories} />
    </div>
  );
};

export default page;
