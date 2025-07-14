"use client";

import { Input } from "@/components/ui/input";
import Image from "next/legacy/image";
import { type ChangeEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import type { IImageFile } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, X, CheckCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  files: IImageFile[];
  setFiles: (files: IImageFile[]) => void;
  color: string;
}

const ImagesGrid = ({ files, setFiles, color }: Props) => {
  const existingFiles = files;
  const [loading, setLoading] = useState<{ [key: string]: { action: string; progress: number } }>({});

  const setImageLoading = (id: string, action: string, progress = 0) => {
    setLoading((prev) => ({
      ...prev,
      [id]: { action, progress },
    }));
  };

  const clearImageLoading = (id: string) => {
    setLoading((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const uploadImage = async (file: File, id: string): Promise<{ data: IImageFile[]; exists: boolean }> => {
    if (!file.type.includes("image")) return { data: [], exists: false };

    setImageLoading(id, "uploading", 0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Simulate progress (you can implement real progress tracking if your API supports it)
      setImageLoading(id, "uploading", 30);

      const response = await fetch("/api/image", { method: "POST", body: formData });
      const res = await response.json();

      setImageLoading(id, "uploading", 80);

      if (!res.ok) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        clearImageLoading(id);
        return { data: [], exists: false };
      }

      const fileURL = res.data.secure_url;
      const public_id = res.data.public_id;
      const blob = URL.createObjectURL(file);
      const existingFileIndex = files.findIndex((f) => f.key === id);

      setImageLoading(id, "uploading", 100);

      if (existingFileIndex !== -1) {
        const oldImgPublicId = existingFiles[existingFileIndex].publicId;
        await fetch(`/api/image?public_ids=${oldImgPublicId}`, { method: "DELETE" });
        const data = files.map((f) =>
          f.key === id ? { key: id, color, blob: blob, url: fileURL, publicId: public_id } : f
        );
        clearImageLoading(id);
        return { data, exists: true };
      } else {
        const data = [{ key: id, color, blob: blob, url: fileURL, publicId: public_id }];
        clearImageLoading(id);
        return { data, exists: false };
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An error occurred during upload. Please try again.",
        variant: "destructive",
      });
      clearImageLoading(id);
      return { data: [], exists: false };
    }
  };

  const handleImage = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files, id } = e.target;

    if (!files || files.length === 0) return;

    if (files.length > 5) {
      toast({
        title: "Too Many Files",
        description: "Maximum 5 images allowed per color variant.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newFiles: IImageFile[] = [];
      const colorHex = id.split("-")[1];

      if (files.length === 1) {
        // Single file upload
        const file = files[0];
        const { data, exists } = await uploadImage(file, id);
        if (exists) setFiles(data);
        else if (data.length) setFiles([...existingFiles, data[0]]);
      } else {
        // Multiple files upload
        const availableFiles = existingFiles.filter((f) => f.color === colorHex).map((f) => f.key.split("-")[0]);
        const availableUploads: string[] = ["image1", "image2", "image3", "image4", "image5"].filter(
          (key) => !availableFiles.includes(key)
        );

        if (availableUploads.length === 0) {
          toast({
            title: "All Slots Filled",
            description: "All image slots are already filled for this color.",
            variant: "destructive",
          });
          return;
        }

        const uploadPromises = availableUploads.map((key, index) => {
          const file = files[index];
          if (!file) return;
          return uploadImage(file, `${key}-${colorHex}`);
        });

        const uploadResults = await Promise.all(uploadPromises);
        uploadResults.forEach((result) => {
          if (result) newFiles.push(result.data[0]);
        });
        setFiles([...existingFiles, ...newFiles]);
      }
    } catch (error) {
      toast({
        title: "Upload Error",
        description: "An error occurred during the upload process.",
        variant: "destructive",
      });
    }
  };

  const removeImage = async (label: string) => {
    setImageLoading(label, "deleting");
    const publicId = files.find((f) => f.key === label)?.publicId || "";

    try {
      await fetch(`/api/image?public_ids=${publicId}`, { method: "DELETE" });
      const filterdFiles = files.filter((f) => f.key !== label);
      setFiles(filterdFiles);
      toast({
        title: "Image Removed",
        description: "Image has been successfully deleted.",
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete image. Please try again.",
        variant: "destructive",
      });
    } finally {
      clearImageLoading(label);
    }
  };

  const uploadedCount = files.filter((f) => f.color === color).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Product Images</h3>
          <p className="text-sm text-muted-foreground">Upload up to 5 high-quality images for this color variant</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {uploadedCount}/5 uploaded
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {["image1", "image2", "image3", "image4", "image5"].map((label, index) => (
          <ImageBox
            key={label}
            files={files}
            handleImage={handleImage}
            removeImage={removeImage}
            label={label}
            loading={loading}
            color={color}
            index={index + 1}
          />
        ))}
      </div>

      {uploadedCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>
            {uploadedCount} image{uploadedCount > 1 ? "s" : ""} uploaded successfully
          </span>
        </div>
      )}
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
  index,
}: {
  label: string;
  files: IImageFile[];
  handleImage: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (label: string) => void;
  loading: { [key: string]: { action: string; progress: number } };
  color: string;
  index: number;
}) => {
  const labelWithColor = label + "-" + color;
  const fileIndex = files.findIndex((f) => f.key === labelWithColor);
  const hasImage = fileIndex !== -1;
  const imageLoading = loading[labelWithColor];
  const isUploading = imageLoading?.action === "uploading";
  const isDeleting = imageLoading?.action === "deleting";
  const progress = imageLoading?.progress || 0;

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-200",
        hasImage ? "ring-2 ring-green-500/20" : "border-dashed border-2",
        isUploading && "ring-2 ring-blue-500/50",
        isDeleting && "ring-2 ring-red-500/50"
      )}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative">
          <Label
            htmlFor={labelWithColor}
            className={cn(
              "cursor-pointer h-full w-full flex items-center justify-center overflow-hidden",
              (isUploading || isDeleting) && "cursor-not-allowed"
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center justify-center space-y-2 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-blue-600 font-medium">Uploading...</span>
              </div>
            ) : isDeleting ? (
              <div className="flex flex-col items-center justify-center space-y-2 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-red-600" />
                <span className="text-xs text-red-600 font-medium">Deleting...</span>
              </div>
            ) : hasImage ? (
              <div className="relative w-full h-full">
                <Image
                  src={files[fileIndex]?.blob || files[fileIndex]?.url}
                  alt={`Product image ${index}`}
                  width={200}
                  height={200}
                  priority
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                  <div className="opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2 p-4 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-3 rounded-full bg-muted">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium">Add Image</span>
                <span className="text-xs">#{index}</span>
              </div>
            )}
          </Label>

          <Input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            id={labelWithColor}
            onChange={handleImage}
            disabled={isUploading || isDeleting}
          />

          {hasImage && !isUploading && !isDeleting && (
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full"
              onClick={() => removeImage(labelWithColor)}
            >
              <X className="h-3 w-3" />
            </Button>
          )}

          {hasImage && (
            <Badge variant="secondary" className="absolute bottom-2 left-2 text-xs">
              #{index}
            </Badge>
          )}
        </div>
      </CardContent>

      {hasImage && !isUploading && !isDeleting && (
        <div className="absolute top-2 left-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      )}
    </Card>
  );
};

export default ImagesGrid;
