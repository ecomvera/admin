import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Label } from "@/components/ui/label";

interface Props {
  files: { name: string; value: string }[];
  setFiles: Dispatch<
    SetStateAction<
      {
        name: string;
        value: string;
      }[]
    >
  >;
}

const ImageContainer = ({ files, setFiles }: Props) => {
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        if (files.some((f) => f.name === e.target.id)) {
          setFiles((files) => files.map((f) => (f.name === e.target.id ? { name: e.target.id, value: imageDataUrl } : f)));
        } else {
          setFiles((files) => [...files, { name: e.target.id, value: imageDataUrl }]);
        }
      };

      fileReader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex gap-3">
      <ImageBox files={files} handleImage={handleImage} label="image1" />
      <ImageBox files={files} handleImage={handleImage} label="image2" />
      <ImageBox files={files} handleImage={handleImage} label="image3" />
      <ImageBox files={files} handleImage={handleImage} label="image4" />
      <ImageBox files={files} handleImage={handleImage} label="image5" />
    </div>
  );
};

const ImageBox = ({
  label,
  files,
  handleImage,
}: {
  label: string;
  files: { name: string; value: string }[];
  handleImage: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const i = files.findIndex((f) => f.name === label);
  return (
    <div className="flex flex-col gap-1 items-center pb-3">
      <div className="border w-24 h-24">
        <Label htmlFor={label} className="cursor-pointer h-full flex items-center justify-center overflow-hidden">
          {files[i]?.value ? (
            <Image src={files[i]?.value} alt="image" width={96} height={96} priority className="object-cover" />
          ) : (
            <Image src={"/assets/fallback.jpg"} alt="image" width={96} height={96} priority className="object-cover" />
          )}
        </Label>

        <Input type="file" accept="image/*" className="hidden" id={label} onChange={(e) => handleImage(e)} />
      </div>
      <p className="text-sm">{label.slice(0, 1).toUpperCase() + label.slice(1)}</p>
    </div>
  );
};

export default ImageContainer;
