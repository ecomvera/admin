"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createAttribute } from "@/lib/actions/attribute.action";
import { error, success } from "@/lib/utils";
import { useEnumsStore } from "@/stores/enums";
import type { IAttribute } from "@/types";
import { capitalize } from "lodash";
import { CheckIcon, CircleIcon, PlusCircle } from "lucide-react";
import React, { useRef } from "react";
import { Label } from "@/components/ui/label";

const CreateAttribute = ({ productTypeId }: { productTypeId: string }) => {
  const { addAttributeKey } = useEnumsStore();
  const [open, setOpen] = React.useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.length < 3) return error("Attribute name must be at least 3 characters long");

    setLoading(true);
    const res = await createAttribute(capitalize(value.trim()), productTypeId);
    setLoading(false);

    if (!res?.ok) return error(res?.error || "Something went wrong");

    addAttributeKey(res?.data as IAttribute, productTypeId);
    success("Attribute added successfully");
    setValue("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <PlusCircle className="w-4 h-4 mr-1" />
          Add Attribute
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Add New Attribute</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="attribute-name">Attribute Name</Label>
            <Input
              id="attribute-name"
              ref={inputRef}
              type="text"
              placeholder="e.g. Material, Fit, Style"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={loading || value === ""} type="submit">
              {loading ? (
                <>
                  <CircleIcon className="w-4 h-4 animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Add Attribute
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAttribute;
