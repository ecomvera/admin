import React from "react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { IGroupCategory } from "@/types";
import { DeleteGroupCategory } from "../dialogs/deleteGroupCategory";
import Link from "next/link";

const ListCollections = ({ categories }: { categories: IGroupCategory[] }) => {
  return (
    <Command className="h-full max-h-[400px]">
      <CommandInput placeholder="Type a collection or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {categories?.map((category: IGroupCategory) => (
          <CommandItem key={category.id}>
            <Link href={`/gc/${category.id}`} className="text-[15px] w-full flex items-center gap-3">
              <p>{category.name}</p>
              {!category.isActive && (
                <span className="text-xs font-semibold text-red-600 bg-red-50 rounded-2xl px-2">inactive</span>
              )}
            </Link>
            <DeleteGroupCategory category={category} />
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
};

export default ListCollections;
