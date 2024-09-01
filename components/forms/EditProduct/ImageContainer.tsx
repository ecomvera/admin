import { Input } from "@/components/ui/input";
import Image from "next/legacy/image";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Label } from "@/components/ui/label";
import { computeSHA256 } from "@/lib/utils";
import { deleteFile, getSignedURL } from "@/lib/actions/aws";
import { toast } from "@/components/ui/use-toast";
import { RxCrossCircled } from "react-icons/rx";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  files: { key: string; blob?: string; url: string }[];
  setFiles: Dispatch<
    SetStateAction<
      {
        key: string;
        blob?: string;
        url: string;
      }[]
    >
  >;
}

const ImageContainer = ({ files, setFiles }: Props) => {
  const [loading, setLoading] = useState<{ id?: string }>({});

  const uploadImage = async (file: File) => {
    const checksum = await computeSHA256(file);
    const res = await getSignedURL(file.type, file.size, checksum);
    if (!res.success) return;

    const url = res.url || "";

    const result = await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    return result.url.split("?")[0];
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setLoading({ id: e.target.id });
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) return;

      const fileURL = await uploadImage(file);
      if (!fileURL) {
        toast({
          title: "Error",
          description: "File upload failed",
          variant: "destructive",
        });
        setLoading({});
        return;
      }

      const blob = URL.createObjectURL(file);

      if (files.some((f) => f.key === e.target.id)) {
        const i = files.findIndex((f) => f.key === e.target.id);
        const oldURL = files[i].url.split("/")[3];
        await deleteFile(oldURL, "/add-product"); // delete old image
        setFiles((files) => files.map((f) => (f.key === e.target.id ? { key: e.target.id, blob: blob, url: fileURL } : f)));
      } else {
        setFiles((files) => [...files, { key: e.target.id, blob: blob, url: fileURL }]);
      }
    }

    setLoading({});
  };

  const removeImage = async (label: string) => {
    const fileURL = files.find((f) => f.key === label)?.url || "";
    const key = fileURL.split("/")[fileURL.split("/").length - 1];
    await deleteFile(key, "/add-product");
    setFiles((files) => files.filter((f) => f.key !== label));
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
  files: { key: string; blob?: string; url: string }[];
  handleImage: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (label: string) => void;
  loading: { id?: string };
}) => {
  const i = files.findIndex((f) => f.key === label);
  return (
    <div className="flex flex-col gap-1 items-center pb-3">
      <div className="border w-24 h-24">
        <Label htmlFor={label} className="cursor-pointer h-full flex items-center justify-center overflow-hidden">
          {files[i]?.blob ? (
            <Image src={files[i]?.blob} alt="image" width={96} height={96} priority className="object-cover" />
          ) : (
            <Image
              src={files[i]?.url.split("?")[0] || "/assets/fallback.jpg"}
              alt="image"
              width={96}
              height={96}
              priority
              className="object-cover"
            />
          )}
        </Label>

        <Input type="file" accept="image/*" className="hidden" id={label} onChange={(e) => handleImage(e)} />
      </div>
      <div className="flex justify-around w-full items-center">
        {loading?.id === label ? (
          <Skeleton className="w-full h-[20px] rounded-full" />
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
