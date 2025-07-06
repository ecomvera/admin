"use client";

import { useState } from "react";
import ImagesGrid from "./ImagesGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TwitterPicker } from "react-color";
import type { IColor } from "@/types";
import { error } from "@/lib/utils";
import { useFileStore } from "@/stores/product";
import { Plus, Palette, X } from "lucide-react";

interface Props {
  colors: IColor[];
  setColors: (colors: IColor[]) => void;
  defaultColors: IColor[];
}

const ImageContainer = ({ colors, setColors, defaultColors }: Props) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const pickedColor = (color: string) => {
    const isExist = colors.findIndex((c) => c.hex.toUpperCase() === color);
    if (isExist !== -1) return error("Color already selected!");
    setColors([...colors, defaultColors.filter((c) => c.hex.toUpperCase() === color)[0]]);
    setDisplayColorPicker(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Product Images</h3>
          <p className="text-sm text-gray-500">Recommended size: 640px × 800px</p>
        </div>
        <div className="relative">
          <Button
            variant="outline"
            onClick={() => setDisplayColorPicker(!displayColorPicker)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Color
          </Button>
          {displayColorPicker && (
            <div className="absolute right-0 top-12 z-50">
              <div className="fixed inset-0" onClick={() => setDisplayColorPicker(false)} />
              <div className="bg-white rounded-lg shadow-lg border p-2">
                <TwitterPicker
                  width="276px"
                  triangle="hide"
                  colors={defaultColors.map((c) => c.hex)}
                  onChange={(color: any) => pickedColor(color.hex.toUpperCase())}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {colors.map((color) => (
          <ColorContainer
            key={color.id}
            color={color.hex}
            colors={colors}
            setColors={setColors}
            defaultColors={defaultColors}
          />
        ))}
        {colors.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Palette className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-center">
                No colors selected yet. Click "Add Color" to start adding product images.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const ColorContainer = ({
  color,
  colors,
  setColors,
  defaultColors,
}: {
  color: string;
  colors: IColor[];
  setColors: (colors: IColor[]) => void;
  defaultColors: IColor[];
}) => {
  const { files, setFiles } = useFileStore();
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const updateColor = (newColor: any) => {
    const isExist = colors.findIndex((c) => c.hex === newColor);
    if (isExist !== -1) return error("Color already selected!");
    setColors(colors.map((c) => (c.hex === color ? defaultColors.filter((c) => c.hex === newColor)[0] : c)));
    setFiles(
      files.map((f) => (f.color === color ? { ...f, color: newColor, key: f.key.split("-")[0] + "-" + newColor } : f))
    );
  };

  const colorName = defaultColors.find((c) => c.hex === color)?.name || color;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Button
                size="sm"
                style={{ backgroundColor: color }}
                className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                onClick={() => setDisplayColorPicker(!displayColorPicker)}
              />
              {displayColorPicker && (
                <div className="absolute left-0 top-10 z-50">
                  <div className="fixed inset-0" onClick={() => setDisplayColorPicker(false)} />
                  <div className="bg-white rounded-lg shadow-lg border p-2">
                    <TwitterPicker
                      width="276px"
                      triangle="hide"
                      colors={defaultColors.map((c) => c.hex)}
                      color={color}
                      onChange={(newColor: any) => updateColor(newColor.hex.toUpperCase())}
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-sm">{colorName}</p>
              <p className="text-xs text-gray-500">{color}</p>
            </div>
          </div>
          {files.filter((f) => f.color === color).length === 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => setColors(colors.filter((c) => c.hex !== color))}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <ImagesGrid files={files} setFiles={setFiles} color={color} />
      </CardContent>
    </Card>
  );
};

export default ImageContainer;
