"use server";

import { revalidatePath } from "next/cache";
import Attribute from "../models/attribute.model";
import { connectDB } from "../mongoose";
import { convertToArray } from "../utils";

export const createAttribute = async (data: string, path: string) => {
  connectDB();

  try {
    await Attribute.create({
      title: data,
    });

    revalidatePath(path);
    revalidatePath("/add-product");
    return { ok: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return { ok: false, error: "Attribute already exists" };
    }

    console.log(error);
    return { ok: false, error: error.message };
  }
};

export const fetchAttributes = async () => {
  connectDB();
  const res = await Attribute.find({});
  return convertToArray(res);
};

export const deleteAttribute = async (id: string, path: string) => {
  connectDB();
  await Attribute.findByIdAndDelete(id);
  revalidatePath(path);
};
