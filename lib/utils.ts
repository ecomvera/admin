import c from "crypto";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// convert mongoose object to javascript object
export const convertToArray = (arr: any[], path?: string) => {
  const converted = arr.map((item) => {
    const { _id, __v, ...rest } = item.toObject();
    // category model
    if (path === "category" && item.children?.length > 0) {
      rest.children = convertToArray(item.children);
    }

    // product model
    if (path === "product") {
      rest.images = convertToArray(item.images);
      rest.attributes = convertToArray(item.attributes);
      rest.parentCategory = item.parentCategory.name;
      rest.subCategory = item.subCategory.name;
    }

    return {
      _id: _id.toString(),
      ...rest,
    };
  });

  return converted;
};
