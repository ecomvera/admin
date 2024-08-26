"use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ICategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { DeleteCategory } from "../dialogs/deleteCategory";

const ListCatgorires = ({ allCategories }: { allCategories: ICategory[] }) => {
  return (
    <div className="w-full">
      <h2 className="head-text py-5 tablet:py-8">All Categories</h2>

      <Command>
        <div className="flex gap-3">
          <div className="w-full flex-1">
            <CommandInput placeholder="Search sub-category..." />
          </div>
        </div>
        <CommandList>
          <CommandEmpty>No sub-category found.</CommandEmpty>
          <CommandGroup>
            {allCategories?.map((category) => (
              <>
                <CommandItem key={category._id} className="flex justify-between">
                  <div>
                    {category.name}
                    <Badge variant="outline" className="ml-2 text-light-3">
                      Group
                    </Badge>
                  </div>
                  <DeleteCategory id={category._id} name={category.name} isGroup />
                </CommandItem>
                {category?.children?.map((child) => (
                  <CommandItem key={child._id} className="flex justify-between">
                    <p>{child.name}</p>
                    <DeleteCategory id={child._id} name={child.name} />
                  </CommandItem>
                ))}
              </>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default ListCatgorires;
