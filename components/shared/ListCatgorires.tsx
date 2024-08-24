import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ICategory } from "@/types";

const ListCatgorires = ({ allCategories }: { allCategories: ICategory[] }) => {
  return (
    <div className="w-full">
      <h2 className="head-text py-5 tablet:py-8">All Categories</h2>

      <Command>
        <CommandInput placeholder="Type a category or search..." />
        <CommandList className="max-h-[1000px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {allCategories?.map((category) => (
            <CommandGroup key={category._id} heading={category.name}>
              {category?.children?.map((child) => (
                <CommandItem key={child._id}>{child.name}</CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default ListCatgorires;
