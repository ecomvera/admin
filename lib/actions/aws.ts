"use server";

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateFileName } from "../utils";
import { revalidatePath } from "next/cache";

const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID!,
  },
});

const acceptedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif", "video/mp4"];

const maxFileSize = 10 * 1024 * 1024; // 10MB

export async function getSignedURL(type: string, size: number, checksum: string) {
  if (!acceptedTypes.includes(type)) {
    return { success: false, error: "Invalid file type" };
  }

  if (size > maxFileSize) {
    return { success: false, error: "File too large" };
  }

  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: generateFileName(),
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
  });

  const signedURL = await getSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  return { success: true, url: signedURL };
}

export async function deleteFile(key: string, path: string) {
  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });

  await s3.send(deleteObjectCommand);
  revalidatePath(path);
}
