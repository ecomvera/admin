"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../mongoose";
import { IProduct } from "@/types";
import { convertToArray } from "../utils";
import Category from "../models/category.model";
import Product from "../models/product.model";

export const createProduct = async (product: IProduct) => {
  await connectDB();

  try {
    const category = await Category.findOne({ _id: product.parentCategory });
    if (!category) {
      return { ok: false, error: "Category not found" };
    }

    const subCategory = await Category.findOne({ _id: product.subCategory });
    if (!subCategory) {
      return { ok: false, error: "SubCategory not found" };
    }

    const newProduct = new Product(product);
    const res = await newProduct.save();

    category.products.push(res._id);
    subCategory.products.push(res._id);
    await category.save();
    await subCategory.save();

    revalidatePath("/add-product");
    return { ok: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return { ok: false, error: "Product already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};
