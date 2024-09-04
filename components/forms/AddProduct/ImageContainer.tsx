import React, { Dispatch, SetStateAction, useState } from "react";
import ImagesGrid from "./ImagesGrid";
import { Button } from "@/components/ui/button";
import { BlockPicker } from "react-color";
import { IImageFile } from "@/types";

interface Props {
  colors: string[];
  files: IImageFile[];
  setFiles: (files: IImageFile[]) => void;
  setColors: Dispatch<SetStateAction<string[]>>;
}

const pickerColors = ["#f44336", "#e91e63", "#9c27b0", "yellow"];

const ImageContainer = ({ files, setFiles, colors, setColors }: Props) => {
  const [currentColor, setCurrentColor] = useState("#000000");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const pickedColor = (color: string) => {
    setDisplayColorPicker(false);
    setColors([...colors, color]);
  };

  return (
    <div>
      <div>
        <Button variant="outline" className="flex items-center" onClick={() => setDisplayColorPicker(!displayColorPicker)}>
          <span className="mr-2 text-xl mt-[-3px]">+</span> Add Images
        </Button>
        {displayColorPicker ? (
          <div className="absolute z-[2]">
            <div
              className="fixed top-0 left-0 right-0 bottom-0"
              onClick={() => setDisplayColorPicker(!displayColorPicker)}
            />
            <BlockPicker
              colors={pickerColors}
              color={currentColor}
              onChange={(color: any) => {
                setCurrentColor(color.hex);
                pickedColor(color.hex);
              }}
            />
          </div>
        ) : null}
      </div>

      {colors.map((color) => (
        <ColorContainer key={color} color={color} files={files} setFiles={setFiles} colors={colors} setColors={setColors} />
      ))}
    </div>
  );
};

const ColorContainer = ({
  color,
  files,
  setFiles,
  colors,
  setColors,
}: {
  color: string;
  colors: string[];
  files: IImageFile[];
  setFiles: (files: IImageFile[]) => void;
  setColors: Dispatch<SetStateAction<string[]>>;
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const updateColor = (newColor: any) => {
    setColors(colors.map((c) => (c === color ? newColor.hex : c)));
    setFiles(
      files.map((f) =>
        f.color === color ? { ...f, color: newColor.hex, key: f.key.split("-")[0] + "-" + newColor.hex } : f
      )
    );
  };

  return (
    <div className="mt-5">
      <div className="flex gap-3 m-2 items-center relative">
        <p>{color}</p>
        <Button
          size={"icon"}
          style={{ backgroundColor: color }}
          className="border border-black rounded"
          onClick={() => setDisplayColorPicker(!displayColorPicker)}
        ></Button>
        {displayColorPicker && (
          <div className="absolute z-[2]">
            <div className="fixed top-0 left-0 right-0 bottom-0" onClick={() => setDisplayColorPicker(false)} />
            <BlockPicker colors={pickerColors} color={color} onChange={updateColor} className="mt-[230px]" />
          </div>
        )}

        {files.filter((f) => f.color === color).length === 0 && (
          <Button
            variant="outline"
            size={"icon"}
            className="px-2 text-base font-bold text-red-500 rounded hover:border-gray-300"
            onClick={() => {
              setColors(colors.filter((c) => c !== color));
            }}
          >
            X
          </Button>
        )}
      </div>
      <ImagesGrid files={files} setFiles={setFiles} color={color} />
    </div>
  );
};

export default ImageContainer;
