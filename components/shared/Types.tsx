"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { createAttribute } from "@/lib/actions/attribute.action";
import { error, success } from "@/lib/utils";
import { IAttribute } from "@/types";
import { useEnumsStore } from "@/stores/enums";
import { upperFirst } from "lodash";
import { createProductTypeDB } from "@/lib/actions/type.action";
import { DeleteType } from "../dialogs/deleteType";

const Types = ({ types, isLoading }: { types: string[]; isLoading: boolean }) => {
  const { addType } = useEnumsStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (name.length < 3) return error("Type must be at least 3 characters long");

    setLoading(true);
    const res = await createProductTypeDB(upperFirst(name.trim()));
    setLoading(false);
    if (!res?.ok) return error(res?.error);

    addType(res?.data?.name as string);
    success("Type created successfully");
    setName("");
  };

  return (
    <div className="px-2 flex flex-col gap-2 pt-[1px]">
      <Input placeholder="Add product type e.g. Shirt | T-Shirt" value={name} onChange={(e) => setName(e.target.value)} />
      <Button disabled={loading || name === ""} className="bg-dark-3 w-[100px] rounded-xl" onClick={onSubmit}>
        {loading ? "Adding..." : "Add"}
      </Button>

      <div className="flex flex-wrap gap-2 mt-2">
        {types?.map((value) => (
          <p key={value} className="border font-semibold px-2 rounded-full flex items-center gap-2">
            {value} <DeleteType name={value} />
          </p>
        ))}
      </div>
    </div>
  );
};

export default Types;
