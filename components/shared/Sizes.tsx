"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { error, success } from "@/lib/utils";
import { ISize } from "@/types";
import { createSizeDB } from "@/lib/actions/size.action";
import { DeleteSize } from "../dialogs/deleteSize";
import { useEnumsStore } from "@/stores/enums";

const Sizes = ({ sizes }: { sizes: ISize[] }) => {
  const { addSize } = useEnumsStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (name === "") return error("Size is required");

    setLoading(true);
    const res = await createSizeDB(name.trim());
    setLoading(false);
    if (!res?.ok) return error(res?.error);

    addSize(res?.data as ISize);
    success("Size created successfully");
    setName("");
  };

  return (
    <div className="px-2 flex flex-col gap-2 pt-[1px]">
      <Input
        type="text"
        className=""
        placeholder="Type size name or number"
        value={name}
        onChange={(e) => setName(e.target.value.toUpperCase())}
      />
      <Button disabled={loading || name === ""} className="bg-dark-3 w-[100px] rounded-xl" onClick={onSubmit}>
        {loading ? "Adding..." : "Add"}
      </Button>

      <h2 className="text-dark-3 text-lg font-semibold">Current Sizes</h2>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <div key={size.id} className="flex items-center gap-2">
            <p className="text-dark-3 border border-dark-3 font-semibold px-2 rounded-full flex items-center gap-2 pr-1">
              {size.value} <DeleteSize value={size.value} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sizes;
