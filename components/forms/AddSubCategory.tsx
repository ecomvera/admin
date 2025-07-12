import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { Label } from "../ui/label";
import { createSubCategoryDB } from "@/lib/actions/category.action";
import { ICategory } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { useCategoryStore } from "@/stores/category";
import { capitalize } from "lodash";
import { error, success } from "@/lib/utils";
import { useTypes } from "@/hook/useTypes";

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
      success("Sub category created successfully");
      // @ts-ignore
      addCategory(res?.data); // Add the new category to the store
    }
  };

  useEffect(() => {
    if (categories.length === 0) setCategories(data);
  }, []);

  return (
    <form className="flex flex-col justify-start gap-5 border p-2" onSubmit={onSubmit}>
      <Select onValueChange={(v) => setParentId(v)} value={parentId}>
        <SelectTrigger className="text-base" disabled={isLoading}>
          <SelectValue placeholder={isLoading ? "Loading..." : "Select the category"} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div>
        <Label className="text-base text-dark-3">Sub Category Name</Label>
        <Input
          type="text"
          className="account-form_input no-focus mt-2"
          placeholder="Enter sub category name"
          value={name}
          onChange={handleInput}
        />
        <div className="flex items-center gap-2 my-1">
          <Checkbox
            id="offer"
            checked={autoGen}
            onCheckedChange={(val: boolean) => {
              setAutoGen(val);
              if (val) setSlug(name.trim().replace(/\s+/g, "-").toLowerCase());
            }}
          />
          <label htmlFor="offer" className="text-sm select-none">
            Auto generate slug
          </label>
        </div>
        <Input
          type="text"
          className="no-focus"
          value={slug}
          placeholder="Category slug"
          disabled={autoGen}
          onChange={(e) => setSlug(e.target.value)}
        />
      </div>

      <div>
        <Label className="text-base text-dark-3">Wear Type</Label>
        <RadioGroup className="flex mt-2" value={wearType} onValueChange={setWearType}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="topwear" id="topwear" />
            <Label htmlFor="topwear">TopWear</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bottomwear" id="bottomwear" />
            <Label htmlFor="bottomwear">BottomWear</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="footwear" id="footwear" />
            <Label htmlFor="footwear">Footwear</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label className="text-base text-dark-3">Garment type</Label>
        <Select
          onValueChange={(v) => {
            if (["no-types", "loading"].includes(v)) return error("Please select a garment type");
            setGarmentType(v);
          }}
          value={garmentType}
        >
          <SelectTrigger className="text-base mt-2">
            <SelectValue placeholder="select ..." />
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

      <Button type={loading ? "button" : "submit"} className="bg-dark-3 w-[100px] rounded-xl">
        {loading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
};

export default AddSubCategory;
