"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type React from "react";
import { useState } from "react";
import { error, success } from "@/lib/utils";
import { useEnumsStore } from "@/stores/enums";
import { upperFirst } from "lodash";
import { createProductTypeDB } from "@/lib/actions/type.action";
import TypeAttributes from "./TypeAttributes";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

const Types = () => {
  const { addType } = useEnumsStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 3) return error("Type must be at least 3 characters long");

    setLoading(true);
    const res = await createProductTypeDB(upperFirst(name.trim()));
    setLoading(false);

    if (!res?.ok) return error(res?.error);

    addType(res?.data?.id as string, res?.data?.name as string);
    success("Type created successfully");
    setName("");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Add New Product Type</h3>
          <p className="text-sm text-muted-foreground">Create product types like Shirt, T-Shirt, Jeans, etc.</p>
        </div>

        <form onSubmit={onSubmit} className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="Add product type e.g. Shirt | T-Shirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button disabled={loading || name === ""} type="submit" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {loading ? "Adding..." : "Add Type"}
          </Button>
        </form>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Manage Types & Attributes</h3>
        <TypeAttributes />
      </div>
    </div>
  );
};

export default Types;
