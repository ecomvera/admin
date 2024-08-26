"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../mongoose";
import Category from "../models/category.model";
import { ICategory } from "@/types";
import { convertToArray } from "../utils";
import Product from "../models/product.model";
import { deleteFile } from "./aws";

export const createCategory = async (name: string, slug: string, path: string) => {
  connectDB();

  try {
    await Category.create({ name, slug });

    revalidatePath(path);
    return { ok: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return { ok: false, error: "Category already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const createSubCategory = async (categoryId: string, name: string, slug: string, path: string) => {
  connectDB();

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return { ok: false, error: "Category not found" };
    }

    const subCategory = new Category({ name, slug, parentId: categoryId });
    const res = await subCategory.save();
    category.children.push(res._id);
    await category.save();

    revalidatePath(path);
    return { ok: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return { ok: false, error: "Category already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const getParentCategories = async () => {
  connectDB();
  const res = await Category.find({ parentId: null }, { children: 0, products: 0 });
  return convertToArray(res);
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  connectDB();
  const res: ICategory[] = await Category.find({ parentId: null }, { products: 0 }).populate({
    path: "children",
    select: { products: 0 },
  });
  return convertToArray(res, "category");
};

export const deleteCategory = async (id: string) => {
  connectDB();
  const category = await Category.findById(id);
  if (!category) {
    return { ok: false, error: "Category not found" };
  }

  // delete all the products in the category
  for (const product of category.products) {
    const res = await Product.findById(product);
    if (!res) {
      continue;
    }

    for (const image of res.images) {
      const url = image.url.split("/").pop();
      if (url) {
        await deleteFile(url, "/products");
      }
    }

    await Product.deleteOne({ _id: product });
  }

  // delete all the subcategories
  for (const subCategory of category.children) {
    await Category.deleteOne({ _id: subCategory });
  }

  await Category.deleteOne({ _id: id });
  revalidatePath("/categories");
  revalidatePath("/products");

  return { ok: true };
};
