import CategoryTabs from "@/components/shared/CategoryTabs";
import Attributes from "@/components/shared/Attributes";
import ListCatgorires from "@/components/shared/ListCatgorires";
import { fetchAttributes } from "@/lib/actions/attribute.action";
import { getAllCategories, getParentCategories } from "@/lib/actions/category.action";

const page = async () => {
  const attributes = await fetchAttributes();
  const parentCategories = await getParentCategories();
  const allCategories = await getAllCategories();

  return (
    <div className="flex flex-col gap-5 tablet:flex-row">
      <div className="w-full">
        <h2 className="head-text py-8">Add Category</h2>
        <CategoryTabs parentCategories={parentCategories} />

        <Attributes attributes={attributes} />
      </div>

      <ListCatgorires allCategories={allCategories} />
    </div>
  );
};

export default page;
