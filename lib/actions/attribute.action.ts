"use server";

import { revalidatePath } from "next/cache";
import Attribute from "../models/attribute.model";
import { connectDB } from "../mongoose";

export const createAttribute = async (data: string, path: string) => {
  connectDB();

  try {
    await Attribute.create({
      title: data,
    });
    revalidatePath(path);
    return { ok: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return {
        ok: false,
        error: "Attribute already exists",
      };
    }
    console.log(error);
  }
};

export const fetchAttributes = async () => {
  connectDB();
  const res = await Attribute.find({}).exec();

  return res;
};

export const deleteAttribute = async (id: string, path: string) => {
  connectDB();
  await Attribute.findByIdAndDelete(id);
  revalidatePath(path);
};
