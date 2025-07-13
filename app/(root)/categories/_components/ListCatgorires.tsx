"use client";

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { ICategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { DeleteCategory } from "@/components/dialogs/deleteCategory";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleIcon, Cross2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { IoCheckmark } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { createSlug, error } from "@/lib/utils";
import { updateCategoryNameDB } from "@/lib/actions/category.action";
import { useCategoryStore } from "@/stores/category";
import { capitalize } from "lodash";
import { Button } from "@/components/ui/button";

const ListCatgorires = ({ isLoading, allCategories }: { isLoading: boolean; allCategories: ICategory[] }) => {
  const { categories } = useCategoryStore();

  return (
    <Command className="border rounded-lg">
      <CommandInput placeholder={isLoading ? "Loading..." : "Search categories..."} />
      <CommandList className="max-h-[400px]">
        {isLoading ? (
          <CommandEmpty className="py-6">
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-[20px] rounded-full" />
              ))}
            </div>
          </CommandEmpty>
        ) : (
          <CommandEmpty className="py-6">
            <div className="text-center">
              <p className="text-muted-foreground">No categories found.</p>
            </div>
          </CommandEmpty>
        )}
        <CommandGroup>
          {categories?.map((category) => (
            <div key={category.id}>
              <Item category={category} />
              {category?.children?.map((child) => (
                <div key={child.id} className="ml-4">
                  <Item category={child} />
                </div>
              ))}
            </div>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

const Item = ({ category }: { category: ICategory }) => {
  const isGroup = category?.parentId ? false : true;
  const [edit, setEdit] = React.useState(false);
  const [name, setName] = React.useState<string>(category.name);
  const { updateCategoryName } = useCategoryStore();
  const [loading, setLoading] = React.useState(false);

  const handleUpdate = async () => {
    if (name.length < 3) return error("Name must be at least 3 characters");

    setLoading(true);
    const res = await updateCategoryNameDB(category.id || "", capitalize(name), createSlug(name));
    setLoading(false);

    if (!res.ok) return error(res.error || "Something went wrong");

    updateCategoryName(category.id || "", capitalize(name), createSlug(name), isGroup);
    setEdit(false);
  };

  return (
    <CommandItem className="flex justify-between items-center group">
      {edit ? (
        <div className="flex items-center gap-2 flex-1">
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} className="flex-1" autoFocus />
          <div className="flex gap-1">
            {loading ? (
              <CircleIcon className="w-5 h-5 animate-spin" />
            ) : (
              <Button size="sm" variant="ghost" onClick={handleUpdate}>
                <IoCheckmark className="w-4 h-4 text-green-600" />
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={() => setEdit(false)}>
              <Cross2Icon className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <span className="font-medium">{category.name}</span>
            {isGroup && (
              <Badge variant="outline" className="text-xs">
                Parent
              </Badge>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setEdit(true)}
            >
              <Pencil2Icon className="w-4 h-4" />
            </Button>
          </div>
          <DeleteCategory id={category.id} name={category.name} isGroup={isGroup} />
        </>
      )}
    </CommandItem>
  );
};

export default ListCatgorires;
