"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { type ChangeEvent, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { createSubCategoryDB } from "@/lib/actions/category.action";
import type { ICategory } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { useCategoryStore } from "@/stores/category";
import { capitalize } from "lodash";
import { error, success } from "@/lib/utils";
import { useTypes } from "@/hook/useTypes";
import { Separator } from "../ui/separator";

const AddSubCategory = ({ parentCategories: data, isLoading }: { parentCategories: ICategory[]; isLoading: boolean }) => {
  const { addCategory, categories, setCategories } = useCategoryStore();
  const { types, fetchingTypes } = useTypes();
  const [name, setName] = useState("");
  const [autoGen, setAutoGen] = useState(true);
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [wearType, setWearType] = useState("");
  const [garmentType, setGarmentType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    setName(e.target.value);
    if (autoGen) setSlug(e.target.value.trim().replace(/\s+/g, "-").toLowerCase());
  };

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!parentId) return error("Please select a parent category");
    if (!name) return error("Name is required");
    if (!wearType) return error("Wear type is required");
    if (!garmentType) return error("Garment type is required");

    setLoading(true);
    const res = await createSubCategoryDB(parentId, capitalize(name.trim()), slug, wearType, garmentType);
    setLoading(false);

    if (!res?.ok) {
      error(res?.error || "Something went wrong");
    } else {
      setName("");
      setSlug("");
      setWearType("");
      setParentId("");
      setGarmentType("");
      success("Sub category created successfully");
      // @ts-ignore
      addCategory(res?.data);
    }
  };

  useEffect(() => {
    if (categories.length === 0) setCategories(data);
  }, []);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="parent-category" className="text-sm font-medium">
          Parent Category *
        </Label>
        <Select onValueChange={(v) => setParentId(v)} value={parentId}>
          <SelectTrigger id="parent-category" disabled={isLoading}>
            <SelectValue placeholder={isLoading ? "Loading..." : "Select the parent category"} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sub-category-name" className="text-sm font-medium">
            Sub Category Name *
          </Label>
          <Input
            id="sub-category-name"
            type="text"
            placeholder="Enter sub category name"
            value={name}
            onChange={handleInput}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-generate"
              checked={autoGen}
              onCheckedChange={(val: boolean) => {
                setAutoGen(val);
                if (val) setSlug(name.trim().replace(/\s+/g, "-").toLowerCase());
              }}
            />
            <Label htmlFor="auto-generate" className="text-sm">
              Auto generate slug
            </Label>
          </div>
          <Input
            type="text"
            value={slug}
            placeholder="Category slug"
            disabled={autoGen}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-sm font-medium">Wear Type *</Label>
        <RadioGroup value={wearType} onValueChange={setWearType} className="flex flex-wrap gap-6">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="topwear" id="topwear" />
            <Label htmlFor="topwear" className="text-sm">
              TopWear
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bottomwear" id="bottomwear" />
            <Label htmlFor="bottomwear" className="text-sm">
              BottomWear
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="footwear" id="footwear" />
            <Label htmlFor="footwear" className="text-sm">
              Footwear
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="garment-type" className="text-sm font-medium">
          Garment Type *
        </Label>
        <Select
          onValueChange={(v) => {
            if (["no-types", "loading"].includes(v)) return error("Please select a garment type");
            setGarmentType(v);
          }}
          value={garmentType}
        >
          <SelectTrigger id="garment-type">
            <SelectValue placeholder="Select garment type..." />
          </SelectTrigger>
          <SelectContent>
            {types.length === 0 && (
              <SelectItem disabled value="no-types">
                No types available
              </SelectItem>
            )}
            {fetchingTypes && (
              <SelectItem disabled value="loading">
                Loading types...
              </SelectItem>
            )}
            {!fetchingTypes && types.length > 0 && (
              <>
                {types.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <Button type={loading ? "button" : "submit"} className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Sub Category"}
      </Button>
    </form>
  );
};

export default AddSubCategory;
