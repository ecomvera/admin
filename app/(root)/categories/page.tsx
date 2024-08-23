import AddCategory from "@/components/shared/AddCategory";
import ListCatgorires from "@/components/shared/ListCatgorires";

const page = () => {
  return (
    <div className="flex flex-col gap-5 tablet:flex-row">
      <div className="w-full">
        <h2 className="head-text py-8">Add Category</h2>
        <AddCategory />
      </div>

      <ListCatgorires />
    </div>
  );
};

export default page;
