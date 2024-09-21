"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { error, success } from "@/lib/utils";
import { IColor } from "@/types";
import { useEnumsStore } from "@/stores/enums";
import { DeleteColor } from "../dialogs/deleteColor";
import { createColorDB } from "@/lib/actions/color.action";
import { Input } from "../ui/input";

const Colors = ({ colors }: { colors: IColor[] }) => {
  const { addColor } = useEnumsStore();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (name === "" || hex === "") return error("Color is required");

    setLoading(true);
    const res = await createColorDB(name.trim(), hex);
    setLoading(false);
    if (!res?.ok) return error(res?.error);

    addColor(res?.data as IColor);
    success("Color added successfully");
    setName("");
    setHex("");
  };

  return (
    <div className="px-2 flex flex-col gap-2">
      <div className="flex gap-2">
        <Input type="text" placeholder="Color Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="text" placeholder="Color Hex - #fafafa" value={hex} onChange={(e) => setHex(e.target.value)} />
      </div>
      <Button disabled={loading || name === "" || hex === ""} className="bg-dark-3 w-[100px] rounded-xl" onClick={onSubmit}>
        {loading ? "Adding..." : "Add"}
      </Button>

      <h2 className="text-dark-3 text-lg font-semibold">Current Colors</h2>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <div key={color.id} className="flex items-center border border-dark-3 px-2 rounded gap-2">
            <div style={{ backgroundColor: color.hex }} className="w-6 h-6 "></div>
            <p className="text-dark-3 font-semibold  flex items-center gap-2 pr-1">
              {color.name} <DeleteColor name={color.name} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Colors;
