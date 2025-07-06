"use client";
import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { toast } from "../ui/use-toast";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Video, Upload, Loader2 } from "lucide-react";

const VideoContainer = ({ video, setVideo }: { video: string; setVideo: (url: string) => void }) => {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUploadVideo = async (file: File) => {
    if (file.size / 1024 / 1024 > 100) {
      toast({
        title: "Error",
        description: "Video size should be less than 100MB",
      });
      setFile(null);
      setVideo("");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/video", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setVideo(data.data.secure_url);
      } else {
        toast({
          title: "Error",
          description: data.error || "Video upload failed",
        });
        setFile(null);
        setVideo("");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Video upload failed",
      });
      setFile(null);
      setVideo("");
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    if (!file) return;
    handleUploadVideo(file);
  }, [file]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Product Video</h3>
        <p className="text-sm text-gray-500">Upload a video to showcase your product (Max: 100MB)</p>
      </div>

      <input
        id="video"
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        className="hidden"
      />

      {video ? (
        <Card>
          <CardContent className="p-4">
            <div className="w-full max-w-sm">
              <AspectRatio ratio={9 / 16}>
                <video controls className="w-full h-full rounded-lg">
                  <source src={video} type="video/mp4" />
                </video>
              </AspectRatio>
            </div>
          </CardContent>
        </Card>
      ) : uploading ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Uploading video...</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Video className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center mb-4">No video uploaded yet. Add a video to showcase your product.</p>
            <Button
              variant="outline"
              onClick={() => {
                // @ts-ignore
                fileInputRef.current?.click();
              }}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Video
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VideoContainer;
