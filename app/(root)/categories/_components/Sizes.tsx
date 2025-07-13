"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { error, success } from "@/lib/utils";
import type { ISize } from "@/types";
import { createSizeDB } from "@/lib/actions/size.action";
import { DeleteSize } from "@/components/dialogs/deleteSize";
import { useEnumsStore } from "@/stores/enums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { capitalize } from "lodash";
import { CheckIcon, CircleIcon, Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ruler, Plus } from "lucide-react";

const Sizes = ({
  sizes: data,
  sizeCategories,
  isLoading,
}: {
  sizes: ISize[];
  sizeCategories: string[];
  isLoading: boolean;
}) => {
  const { setsizes, sizes } = useEnumsStore();

  useEffect(() => {
    if (sizes.length === 0) setsizes(data || []);
  }, []);

  if (isLoading) {
    return <div className="text-center py-8">Loading sizes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {sizes.map((item, index) => (
          <Item key={index} item={item} />
        ))}
      </div>

      {sizeCategories.length !== sizes.length && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Size Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(v) => setsizes([...sizes, { id: "", type: v, value: [] }])}>
              <SelectTrigger>
                <SelectValue placeholder="Select a size category to add" />
              </SelectTrigger>
              <SelectContent>
                {sizeCategories
                  .filter((item) => !sizes.map((i) => i.type).includes(item))
                  .map((item) => (
                    <SelectItem key={item} value={item}>
                      {capitalize(item)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Item = ({ item }: { item: ISize }) => {
  const { addSize } = useEnumsStore();
  const [loading, setLoading] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>, type: string) => {
    e.preventDefault();
    if (value === "") return error("Size is required");

    setLoading(true);
    const res = await createSizeDB(type, value.trim());
    setLoading(false);

    if (!res?.ok) return error(res?.error);

    addSize(type, value);
    success("Size added successfully");
    setValue("");
    setAddNew(false);
  };

  const getPlaceholder = () => {
    switch (item.type) {
      case "bottomwear":
        return "28, 30, 32, 34";
      case "topwear":
        return "XS, S, M, L";
      default:
        return "UK6, UK7, UK8";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5" />
          {capitalize(item.type)} Sizes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {item.value?.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No sizes defined</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {item.value?.map((value) => (
              <Badge key={value} variant="secondary" className="flex items-center gap-1">
                {value}
                <DeleteSize type={item.type} values={item.value.filter((v) => v !== value)} />
              </Badge>
            ))}
          </div>
        )}

        <Button
          size="sm"
          variant="outline"
          className={`${addNew ? "hidden" : "flex"} items-center gap-1`}
          onClick={() => {
            setAddNew(true);
            setTimeout(() => inputRef?.current?.focus(), 100);
          }}
        >
          <PlusIcon className="w-4 h-4" />
          Add Size
        </Button>

        <form onSubmit={(e) => handleAdd(e, item.type)} className={`flex gap-2 ${!addNew && "hidden"}`}>
          <Input
            ref={inputRef}
            type={item.type === "bottomwear" ? "number" : "text"}
            placeholder={getPlaceholder()}
            value={value}
            onChange={(e) => {
              if (e.target.value.includes(" ")) return;
              if (e.target.value.length > 4) return error("Max 4 characters");
              setValue(e.target.value.toUpperCase());
            }}
            className="flex-1"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setAddNew(false);
              setValue("");
            }}
            type="button"
          >
            <Cross1Icon className="w-4 h-4" />
          </Button>
          <Button size="sm" disabled={loading || value === ""} type="submit">
            {loading ? <CircleIcon className="w-4 h-4 animate-spin" /> : <CheckIcon className="w-4 h-4" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Sizes;
