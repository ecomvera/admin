import { Input } from "@/components/ui/input";
import Image from "next/legacy/image";
import { ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { RxCrossCircled } from "react-icons/rx";
import { IImageFile } from "@/types";

interface Props {
  files: IImageFile[];
  setFiles: (files: IImageFile[]) => void;
  color: string;
}

const ImagesGrid = ({ files, setFiles, color }: Props) => {
  const uploadedFiles = files;
  const [loading, setLoading] = useState<{ id?: string; action?: string }>({});

  // console.log(files);
  // console.log({ color });

  const uploadImage = async (file: File, id: string): Promise<IImageFile[]> => {
    if (!file.type.includes("image")) return files;
    // setLoading({ id: id, action: "uploading" });

    // const formData = new FormData();
    // formData.append("file", file);

    // const response = await fetch("/api/image", { method: "POST", body: formData });
    // const res = await response.json();
    // if (!res.ok) {
    //   toast({
    //     title: "Error",
    //     description: "File upload failed",
    //     variant: "destructive",
    //   });
    //   setLoading({});
    //   return;
    // }

    const fileURL = "res.data.url";
    const public_id = "res.data.public_id";

    const blob = URL.createObjectURL(file);

    if (files.some((f) => f.key === id)) {
      console.log("exists");
      const i = files.findIndex((f) => f.key === id);
      // const oldImgPublicId = files[i].publicId;
      // deleting the old image from cloudinary
      // await fetch(`/api/image?public_ids=${oldImgPublicId}`, { method: "DELETE" });

      const newFiles = files.map((f) =>
        f.key === id ? { key: id, color, blob: blob, url: fileURL, publicId: public_id } : f
      );
      return newFiles;
    } else {
      const newFiles = [...files, { key: id, color, blob: blob, url: fileURL, publicId: public_id }];
      return newFiles;
    }
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { files, id } = e.target;
    if (!files || files.length === 0) return;
    if (files.length > 5) {
      toast({
        title: "Error",
        description: "Maximum 5 images allowed",
        variant: "destructive",
      });
      return;
    }

    // Single file upload
    const file = files[0];
    const newFiles = await uploadImage(file, id);
    setFiles(newFiles);
  };

  const removeImage = async (label: string) => {
    setLoading({ id: label, action: "deleting" });
    // const publicId = files.find((f) => f.key === label)?.publicId || "";
    // await fetch(`/api/image?public_ids=${publicId}`, { method: "DELETE" });
    const filterdFiles = files.filter((f) => f.key !== label);
    setFiles(filterdFiles);
    setLoading({});
  };

  return (
    <div className="flex gap-3 px-2">
      {["image1", "image2", "image3", "image4", "image5"].map((label) => (
        <ImageBox
          key={label}
          files={files}
          handleImage={handleImage}
          removeImage={removeImage}
          label={label}
          loading={loading}
          color={color}
        />
      ))}
    </div>
  );
};

const ImageBox = ({
  label,
  files,
  handleImage,
  removeImage,
  loading,
  color,
}: {
  label: string;
  files: IImageFile[];
  handleImage: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (label: string) => void;
  loading: { id?: string; action?: string };
  color: string;
}) => {
  const labelWithColor = label + "-" + color;
  const i = files.findIndex((f) => f.key === labelWithColor);
  return (
    <div className="flex flex-col gap-1 items-center pb-3">
      <button onClick={() => console.log(color)}>click</button>
      <div className="border w-24 h-24">
        <Label htmlFor={labelWithColor} className="cursor-pointer h-full flex items-center justify-center overflow-hidden">
          {files[i]?.blob ? (
            <Image src={files[i]?.blob} alt="image" width={96} height={96} priority className="object-cover" />
          ) : (
            <Image src={"/assets/fallback.jpg"} alt="image" width={96} height={96} priority className="object-cover" />
          )}
        </Label>

        <Input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id={labelWithColor}
          onChange={(e) => handleImage(e)}
        />
      </div>
      <div className="flex justify-around w-full items-center">
        {loading?.id === labelWithColor ? (
          <p className="text-sm">{loading?.action === "uploading" ? "Uploading..." : "Deleting..."}</p>
        ) : (
          <>
            <p className="text-sm">{label.slice(0, 1).toUpperCase() + label.slice(1)}</p>
            {i !== -1 && (
              <RxCrossCircled className="text-red-700 cursor-pointer" onClick={() => removeImage(labelWithColor)} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImagesGrid;
