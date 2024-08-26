import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createCategory } from "@/lib/actions/category.action";
import { ChangeEvent, useState } from "react";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInput = (e: any) => {
    setName(e.target.value);
    setSlug(e.target.value.trim().replace(/\s+/g, "-").toLowerCase());
  };

  const onSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please enter a category name",
      });
      return;
    }

    setLoading(true);
    const res = await createCategory(name.trim(), slug, "/categories");
    setLoading(false);

    if (!res?.ok) {
      toast({
        title: "Error",
        variant: "destructive",
        description: res?.error,
      });
    } else {
      setName("");
      setSlug("");
      toast({
        title: "Success",
        // variant: "success",
        description: "Category created successfully",
      });
    }
  };

  return (
    <form className="flex flex-col justify-start gap-3 border p-2" onSubmit={onSubmit}>
      <Label className="text-base text-dark-3">Category Name</Label>
      <div>
        <Input
          type="text"
          className="account-form_input no-focus"
          placeholder="Enter category name"
          value={name}
          onChange={handleInput}
        />
        <Label className="account-form_label text-sm text-dark-3">{slug}</Label>
      </div>

      <Button type={loading ? "button" : "submit"} className="bg-dark-3 w-[100px] rounded-xl">
        {loading ? "Adding..." : "Add"}
      </Button>
    </form>
  );
};

export default AddCategory;
