import React, { ChangeEvent, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createCollectionDB, isCollectionExist } from "@/lib/actions/collection.action";
import { createSlug } from "@/lib/utils";
import { capitalize } from "lodash";
import { error, success } from "@/lib/utils";
import { useCollectionStore } from "@/stores/collections";

const Collections = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState<{ blob?: string; file?: globalThis.File; type?: string; status?: string }>();
  const [banner, setBanner] = useState<{ blob?: string; file?: globalThis.File; type?: string; status?: string }>();
  const [loading, setLoading] = useState("");
  const { addCollection } = useCollectionStore();

  const uploadFile = async (file: globalThis.File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/image", { method: "POST", body: formData });
    const res = await response.json();
    return { ...res, type };
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>, type: string) => {
    e.preventDefault();

    if (e.target.files) {
      const file = e.target.files[0];

      if (type === "image") {
        setImage({ blob: URL.createObjectURL(file), file, type: "image" });
      }
      if (type === "banner") {
        setBanner({ blob: URL.createObjectURL(file), file, type: "banner" });
      }
    }
  };

  const handleCreate = async () => {
    setLoading("verifying");

    const isExist = await isCollectionExist(createSlug(name));
    if (isExist) {
      error("Collection already exists");
      setLoading("");
      return;
    }

    setLoading("uploading");
    let imageURL = "";
    let bannerURL = "";
    const uploadPromises = [image, banner].map(async (item) => {
      if (!item) return;
      return await uploadFile(item?.file as globalThis.File, item?.type || "");
    });
    const uploadResults = await Promise.all(uploadPromises);
    uploadResults.forEach((res) => {
      if (!res.ok) return error("File upload failed");
      if (res?.type === "image") {
        imageURL = res.data.secure_url;
      }
      if (res?.type === "banner") {
        bannerURL = res.data.secure_url;
      }
    });

    setLoading("creating");
    const res = await createCollectionDB(capitalize(name.trim()), createSlug(name), imageURL, bannerURL);
    if (!res?.ok) {
      error(res?.error || "Something went wrong");
      setLoading("");
      return;
    }

    success("Collection created successfully");
    // @ts-ignore
    addCollection(res.data);
    setName("");
    setImage({});
    setBanner({});
    setLoading("");
  };

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div className="flex">
          <Input placeholder="Collection name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button className="ml-3 rounded" disabled={!name || !image || !banner || loading !== ""} onClick={handleCreate}>
            {loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> {loading}...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
        <div className="flex flex-col laptop:flex-row gap-3">
          <div className="w-[150px]">
            <p className="text-dark-3">Image</p>
            <Label htmlFor="square-img">
              <AspectRatio ratio={1 / 1} className="border rounded relative">
                {!image?.blob && (
                  <span className="font-semibold text-sm absolute inset-0 m-auto w-full h-fit text-center bg-white">
                    (700px X 700px)
                  </span>
                )}
                <Image
                  src={image?.blob || "/assets/fallback.jpg"}
                  alt="Image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>
            </Label>
          </div>
          <div className="w-full">
            <p className="text-dark-3">Banner Image</p>
            <Label htmlFor="banner-img">
              <AspectRatio ratio={3.57 / 1} className="border rounded relative">
                {!banner?.blob && (
                  <span className="font-semibold text-sm absolute inset-0 m-auto w-full h-fit text-center bg-white">
                    (1000px X 280px)
                  </span>
                )}
                <Image
                  src={banner?.blob || "/assets/fallback.jpg"}
                  alt="Image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="rounded-md object-contain w-full h-full"
                />
              </AspectRatio>
            </Label>
          </div>
        </div>
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          placeholder="Select image"
          id="square-img"
          onChange={(e) => handleImage(e, "image")}
        />
        <Input
          type="file"
          accept="image/*"
          className="hidden"
          placeholder="Select banner image"
          id="banner-img"
          onChange={(e) => handleImage(e, "banner")}
        />
      </div>
    </div>
  );
};

export default Collections;
