"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createCategoryDB } from "@/lib/actions/category.action";
import { type ChangeEvent, useState } from "react";
import { Label } from "../ui/label";
import { useCategoryStore } from "@/stores/category";
import { capitalize } from "lodash";
import { error, success } from "@/lib/utils";

const AddCategory = () => {
  const { addCategory } = useCategoryStore();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    setName(e.target.value);
    setSlug(e.target.value.trim().replace(/\s+/g, "-").toLowerCase());
  };

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) return error("Name is required");

    setLoading(true);
    const res = await createCategoryDB(capitalize(name.trim()), slug);
    setLoading(false);

    if (!res?.ok) {
      error(res?.error || "Something went wrong");
    } else {
      setName("");
      setSlug("");
      success("Category created successfully");
      // @ts-ignore
      addCategory(res?.data);
    }
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="category-name" className="text-sm font-medium">
          Category Name *
        </Label>
        <Input id="category-name" type="text" placeholder="Enter category name" value={name} onChange={handleInput} />
        {slug && (
          <p className="text-sm text-muted-foreground">
            Slug: <code className="bg-muted px-1 py-0.5 rounded text-xs">{slug}</code>
          </p>
        )}
      </div>

      <Button type={loading ? "button" : "submit"} className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Category"}
      </Button>
    </form>
  );
};

export default AddCategory;
