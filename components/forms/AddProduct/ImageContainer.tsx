import { Input } from "@/components/ui/input";
import Image from "next/legacy/image";
import { ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { RxCrossCircled } from "react-icons/rx";

interface Props {
  files: { key: string; blob: string; url: string; publicId: string }[];
  setFiles: (
    files: {
      key: string;
      blob: string;
      url: string;
      publicId: string;
    }[]
  ) => void;
}

const ImageContainer = ({ files, setFiles }: Props) => {
  const [loading, setLoading] = useState<{ id?: string; action?: string }>({});

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setLoading({ id: e.target.id, action: "uploading" });
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) return;

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/image", { method: "POST", body: formData });
      const res = await response.json();
      if (!res.ok) {
        toast({
          title: "Error",
          description: "File upload failed",
          variant: "destructive",
        });
        setLoading({});
        return;
      }

      const fileURL = res.data.url;
      const public_id = res.data.public_id;

      const blob = URL.createObjectURL(file);

      if (files.some((f) => f.key === e.target.id)) {
        const i = files.findIndex((f) => f.key === e.target.id);
        const oldImgPublicId = files[i].publicId;
        // deleting the old image from cloudinary
        await fetch(`/api/image?public_ids=${oldImgPublicId}`, { method: "DELETE" });

        const newFiles = files.map((f) =>
          f.key === e.target.id ? { key: e.target.id, blob: blob, url: fileURL, publicId: public_id } : f
        );
        setFiles(newFiles);
      } else {
        const newFiles = [...files, { key: e.target.id, blob: blob, url: fileURL, publicId: public_id }];
        setFiles(newFiles);
      }
    }

    setLoading({});
  };

  const removeImage = async (label: string) => {
    setLoading({ id: label, action: "deleting" });
    const publicId = files.find((f) => f.key === label)?.publicId || "";
    await fetch(`/api/image?public_ids=${publicId}`, { method: "DELETE" });
    const filterdFiles = files.filter((f) => f.key !== label);
    setFiles(filterdFiles);
    setLoading({});
  };

  return (
    <div className="flex gap-3 px-2">
      <ImageBox files={files} handleImage={handleImage} removeImage={removeImage} label="image1" loading={loading} />
      <ImageBox files={files} handleImage={handleImage} removeImage={removeImage} label="image2" loading={loading} />
      <ImageBox files={files} handleImage={handleImage} removeImage={removeImage} label="image3" loading={loading} />
      <ImageBox files={files} handleImage={handleImage} removeImage={removeImage} label="image4" loading={loading} />
      <ImageBox files={files} handleImage={handleImage} removeImage={removeImage} label="image5" loading={loading} />
    </div>
  );
};

const ImageBox = ({
  label,
  files,
  handleImage,
  removeImage,
  loading,
}: {
  label: string;
  files: { key: string; blob: string }[];
  handleImage: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (label: string) => void;
  loading: { id?: string; action?: string };
}) => {
  const i = files.findIndex((f) => f.key === label);
  return (
    <div className="flex flex-col gap-1 items-center pb-3">
      <div className="border w-24 h-24">
        <Label htmlFor={label} className="cursor-pointer h-full flex items-center justify-center overflow-hidden">
          {files[i]?.blob ? (
            <Image src={files[i]?.blob} alt="image" width={96} height={96} priority className="object-cover" />
          ) : (
            <Image src={"/assets/fallback.jpg"} alt="image" width={96} height={96} priority className="object-cover" />
          )}
        </Label>

        <Input type="file" accept="image/*" className="hidden" id={label} onChange={(e) => handleImage(e)} />
      </div>
      <div className="flex justify-around w-full items-center">
        {loading?.id === label ? (
          <p className="text-sm">{loading?.action === "uploading" ? "Uploading..." : "Deleting..."}</p>
        ) : (
          <>
            <p className="text-sm">{label.slice(0, 1).toUpperCase() + label.slice(1)}</p>
            {i !== -1 && <RxCrossCircled className="text-red-700 cursor-pointer" onClick={() => removeImage(label)} />}
          </>
        )}
      </div>
    </div>
  );
};

export default ImageContainer;
