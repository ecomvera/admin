"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../mongoose";
import { IProduct } from "@/types";
import Category from "../models/category.model";
import Product from "../models/product.model";
import { deleteFile } from "./aws";

export const createProduct = async (product: IProduct) => {
  await connectDB();

  try {
    const category = await Category.findOne({ _id: product.category });
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

    revalidatePath("/products");
    return { ok: true };
  } catch (error: any) {
    if (error.code === 11000) {
      return { ok: false, error: "Product already exists" };
    }

    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const updateProduct = async (id: string | undefined, product: IProduct, path: string) => {
  if (!id) {
    return { ok: false, error: "Invalid product ID" };
  }

  await connectDB();

  try {
    const data = await Product.findById(id);
    if (!data) {
      return { ok: false, error: "Product not found" };
    }

    // Fetch related categories
    const category = await Category.findById(data.category);
    const subCategory = await Category.findById(data.subCategory);

    if (!category || !subCategory) {
      return { ok: false, error: "Related categories not found" };
    }

    if (data.category.toString() !== product.category) {
      // Remove the product from the old parent and sub categories
      category.products = category.products.filter((item: Object) => item.toString() !== id);
      await category.save();

      subCategory.products = subCategory.products.filter((item: Object) => item.toString() !== id);
      await subCategory.save();

      // Add the product to the new category
      const newCategory = await Category.findById(product.category);
      if (!newCategory) {
        return { ok: false, error: "New category not found" };
      }
      newCategory.products.push(data._id);
      await newCategory.save();

      // Add the product to the new sub category
      const newSubCategory = await Category.findById(product.subCategory);
      if (!newSubCategory) {
        return { ok: false, error: "New sub category not found" };
      }
      newSubCategory.products.push(data._id);
      await newSubCategory.save();
    } else if (data.subCategory.toString() !== product.subCategory) {
      // Remove the product from the old sub category
      subCategory.products = subCategory.products.filter((item: Object) => item.toString() !== id);
      await subCategory.save();

      // Add the product to the new sub category
      const newSubCategory = await Category.findById(product.subCategory);
      if (!newSubCategory) {
        return { ok: false, error: "New sub category not found" };
      }
      newSubCategory.products.push(data._id);
      await newSubCategory.save();
    }

    // Update the product with new values
    await Product.findByIdAndUpdate(id, product, { new: true });

    revalidatePath(path);
    return { ok: true };
  } catch (error: any) {
    console.error(error);
    return { ok: false, error: error.message };
  }
};

export const deleteProduct = async (id: string | undefined, path: string) => {
  await connectDB();

  // delete the connection between the product and the category
  const product = await Product.findById(id);
  if (!product) {
    return;
  }

  const category = await Category.findById(product.category);
  if (!category) {
    return;
  }

  category.products = category.products.filter((item: Object) => item.toString() !== id);
  await category.save();

  const subCategory = await Category.findById(product.subCategory);
  if (!subCategory) {
    return;
  }

  subCategory.products = subCategory.products.filter((item: Object) => item.toString() !== id);
  await subCategory.save();

  // delete the images from s3
  for (const image of product.images) {
    const url = image.url.split("/").pop();
    await deleteFile(url, "/products");
  }

  // delete the product from the database
  await Product.findByIdAndDelete(id);
  revalidatePath(path);
};
