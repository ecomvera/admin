"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { error, success } from "@/lib/utils";
import type { IColor } from "@/types";
import { useEnumsStore } from "@/stores/enums";
import { DeleteColor } from "@/components/dialogs/deleteColor";
import { createColorDB } from "@/lib/actions/color.action";
import { Input } from "@/components/ui/input";
import tinyColor from "tinycolor2";
import { SliderPicker } from "react-color";
import { capitalize } from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Palette, Plus } from "lucide-react";

const Colors = ({ colors: data, isLoading }: { colors: IColor[]; isLoading: boolean }) => {
  const { colors, addColor, setColors } = useEnumsStore();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#000000");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name === "" || hex === "") return error("Color name and hex are required");

    setLoading(true);
    const res = await createColorDB(capitalize(name.trim()), hex.trim());
    setLoading(false);

    if (!res?.ok) return error(res?.error);

    addColor(res?.data as IColor);
    success("Color added successfully");
    setName("");
    setHex("#000000");
  };

  const handleName = (e: any) => {
    setName(e.target.value);
    const color = tinyColor(e.target.value);
    if (color.isValid()) {
      setHex(color.toHexString());
    }
  };

  useEffect(() => {
    if (colors.length === 0) setColors(data);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Color
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color-name">Color Name</Label>
                <Input
                  id="color-name"
                  type="text"
                  placeholder="e.g. Navy Blue, Forest Green"
                  value={name}
                  onChange={handleName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color-hex">Hex Code</Label>
                <Input
                  id="color-hex"
                  type="text"
                  placeholder="#000000"
                  value={hex}
                  onChange={(e) => setHex(e.target.value)}
                />
              </div>
            </div>

            {hex && (
              <div className="space-y-3">
                <div className="w-full h-20 rounded-lg border-2 border-border" style={{ backgroundColor: hex }} />
                <SliderPicker color={hex} onChange={(color) => setHex(color.hex)} />
              </div>
            )}

            <Button disabled={loading || name === "" || hex === ""} className="w-full" type="submit">
              {loading ? "Adding..." : "Add Color"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Color Palette ({colors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading colors...</div>
          ) : colors.length === 0 ? (
            <div className="text-center py-8">
              <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No colors found. Add your first color above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {colors.map((color) => (
                <div key={color.id} className="group">
                  <div className="border rounded-lg overflow-hidden">
                    <div style={{ backgroundColor: color.hex }} className="h-16 w-full" />
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{color.name}</p>
                          <p className="text-xs text-muted-foreground">{color.hex}</p>
                        </div>
                        <DeleteColor name={color.name} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Colors;
