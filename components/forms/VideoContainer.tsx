"use client";

import { Button } from "../ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { toast } from "../ui/use-toast";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Video, Upload, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const VideoContainer = ({ video, setVideo }: { video: string; setVideo: (url: string) => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUploadVideo = async (file: File) => {
    if (file.size / 1024 / 1024 > 100) {
      toast({
        title: "Error",
        description: "Video size should be less than 100MB",
        variant: "destructive",
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
        toast({
          title: "Success",
          description: "Video uploaded successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Video upload failed",
          variant: "destructive",
        });
        setFile(null);
        setVideo("");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error",
        description: "Video upload failed",
        variant: "destructive",
      });
      setFile(null);
      setVideo("");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteVideo = async () => {
    if (!video) return;

    setDeleting(true);

    try {
      // Extract public_id from Cloudinary URL
      const urlParts = video.split("/");
      const fileNameWithExtension = urlParts[urlParts.length - 1];
      const publicId = fileNameWithExtension.split(".")[0];

      const res = await fetch(`/api/video?public_ids=${publicId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setVideo("");
        setFile(null);
        toast({
          title: "Success",
          description: "Video deleted successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to delete video",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleReplaceVideo = () => {
    setVideo("");
    setFile(null);
    fileInputRef.current?.click();
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
            <div className="relative">
              <div className="w-full max-w-sm h-[200px] overflow-hidden rounded-lg">
                <video controls className="w-full h-full rounded-lg">
                  <source src={video} type="video/mp4" />
                </video>
              </div>

              {/* Video Actions */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReplaceVideo}
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Upload className="h-4 w-4" />
                  Replace
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deleting}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                    >
                      {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Video</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this video? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteVideo} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : uploading ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Uploading video...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we process your video</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Video className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center mb-4">No video uploaded yet. Add a video to showcase your product.</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
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
