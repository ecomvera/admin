"use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ICategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { DeleteCategory } from "../dialogs/deleteCategory";
import { Skeleton } from "../ui/skeleton";

const ListCatgorires = ({ isLoading, allCategories }: { isLoading: boolean; allCategories: ICategory[] }) => {
  return (
    <div className="w-full">
      <h2 className="head-text py-5 tablet:py-8">All Categories</h2>

      <Command>
        <div className="flex gap-3">
          <div className="w-full flex-1">
            <CommandInput placeholder={isLoading ? "Loading..." : "Search sub-category..."} />
          </div>
        </div>
        <CommandList>
          {isLoading ? (
            <CommandEmpty className="flex flex-col gap-5 mt-5">
              <Skeleton className="w-full h-[20px] rounded-full" />
              <Skeleton className="w-full h-[20px] rounded-full" />
              <Skeleton className="w-full h-[20px] rounded-full" />
              <Skeleton className="w-full h-[20px] rounded-full" />
              <Skeleton className="w-full h-[20px] rounded-full" />
            </CommandEmpty>
          ) : (
            <CommandEmpty>No sub-category found.</CommandEmpty>
          )}
          <CommandGroup>
            {allCategories?.map((category) => (
              <div key={category.id}>
                <CommandItem key={category.id} className="flex justify-between">
                  <div>
                    {category.name}
                    <Badge variant="outline" className="ml-2 text-light-3">
                      Group
                    </Badge>
                  </div>
                  <DeleteCategory id={category.id} name={category.name} isGroup />
                </CommandItem>
                {category?.children?.map((child) => (
                  <CommandItem key={child.id} className="flex justify-between">
                    <p>{child.name}</p>
                    <DeleteCategory id={child.id} name={child.name} />
                  </CommandItem>
                ))}
              </div>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
};

export default ListCatgorires;
