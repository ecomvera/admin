import AddCategory from "@/components/shared/AddCategory";
import Attributes from "@/components/shared/Attributes";
import ListCatgorires from "@/components/shared/ListCatgorires";
import { fetchAttributes } from "@/lib/actions/attribute.action";

const page = async () => {
  const attributes = await fetchAttributes();

  return (
    <div className="flex flex-col gap-5 tablet:flex-row">
      <div className="w-full">
        <h2 className="head-text py-8">Add Category</h2>
        <AddCategory />

        <Attributes attributes={attributes} />
      </div>

      <ListCatgorires />
    </div>
  );
};

export default page;
