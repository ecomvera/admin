import c from "crypto";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const pickerColors = ["#f44336", "#e91e63", "#9c27b0", "yellow"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const fetchOpt = {
  revalidateOnFocus: false,
  // dedupingInterval: 60000,
  revalidateOnMount: false,
};

export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

export async function computeSHA256(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

export const generateFileName = (bytes = 32) => c.randomBytes(bytes).toString("hex");

export const createSlug = (name: string) => name.trim().replace(/\s+/g, "-").toLowerCase();

export const getPublicId = (url: string) => {
  const splitUrl = url.split("/upload/")[1].split("/").slice(1).join("/");
  return splitUrl.substring(0, splitUrl.lastIndexOf("."));
};
