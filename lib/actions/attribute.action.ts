"use server";

import { revalidatePath } from "next/cache";
import Attribute from "../models/attribute.model";
import { connectDB } from "../mongoose";

export const createAttribute = async (data: string, path: string) => {
  await connectDB();

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

export const deleteAttribute = async (id: string, path: string) => {
  await connectDB();
  await Attribute.findByIdAndDelete(id);
  revalidatePath(path);
};
