import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ChangeEvent, useState } from "react";
import { Label } from "../ui/label";
import { createSubCategory } from "@/lib/actions/category.action";
import { toast } from "../ui/use-toast";
import { ICategory } from "@/types";

const AddSubCategory = ({ parentCategories }: { parentCategories: ICategory[] }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");

  const handleInput = (e: any) => {
    setName(e.target.value);
    setSlug(e.target.value.trim().replace(/\s+/g, "-").toLowerCase());
  };

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!parentId) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please select a category",
      });
      return;
    }

    if (!name) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please enter a category name",
      });
      return;
    }

    const res = await createSubCategory(parentId, name.trim(), slug, "/categories");

    if (!res?.ok) {
      toast({
        title: "Error",
        variant: "destructive",
        description: res?.error,
      });
    } else {
      setName("");
      setSlug("");
      setParentId("");
      toast({
        title: "Success",
        variant: "success",
        description: "Category created successfully",
      });
    }
  };

  return (
    <form className="flex flex-col justify-start gap-5 border p-2" onSubmit={onSubmit}>
      <Select onValueChange={(v) => setParentId(v)} value={parentId}>
        <SelectTrigger className="text-base">
          <SelectValue placeholder="Select the category" />
        </SelectTrigger>
        <SelectContent>
          {parentCategories.map((category) => (
            <SelectItem key={category._id} value={category._id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div>
        <Label className="text-base text-dark-3">Category Name</Label>
        <Input type="text" className="account-form_input no-focus mt-2" value={name} onChange={handleInput} />
        <Label className="account-form_label text-sm text-dark-3">{slug}</Label>
      </div>

      <Button type="submit" className="bg-dark-3 w-[100px] rounded-xl">
        Add
      </Button>
    </form>
  );
};

export default AddSubCategory;
