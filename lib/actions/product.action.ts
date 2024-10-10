"use server";

import { IProduct } from "@/types";
import { prisma } from "../prisma";

export const createProduct = async (product: IProduct) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: product.categoryId } });
    if (!category) {
      return { ok: false, error: "Category not found" };
    }

    const res = await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        mrp: product.mrp,
        material: product.material,
        productType: product.productType,
        sizeCategory: product.sizeCategory,
        inStock: product.inStock,
        isNewArrival: product.isNewArrival,
        isBestSeller: false,
        genders: product.genders,
        categoryId: product.categoryId,
      },
    });

    // create product colors
    await prisma.productColors.createMany({
      data: product.colors.map((color) => ({
        name: color.name,
        hex: color.hex,
        productId: res.id,
      })),
    });

    // create product sizes
    await prisma.productSizes.createMany({
      data: product.sizes.map((size) => ({
        key: size.key,
        value: size.value,
        quantity: size.quantity,
        productColor: size.productColor,
        productId: res.id,
      })),
    });

    // create product images
    await prisma.productImages.createMany({
      data: product.images.map((image) => ({
        key: image.key,
        url: image.url,
        color: image.color,
        publicId: image.publicId,

        productId: res.id,
      })),
    });

    // create product attributes
    await prisma.productAttributes.createMany({
      data: product.attributes.map((attribute) => ({
        key: attribute.key,
        value: attribute.value,
        productId: res.id,
      })),
    });

    return { ok: true, productId: res.id };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Product already exists" };
    }

    console.error(error);
    return { ok: false, error: "Something went wrong" };
  }
};

export const updateProductDB = async (id: string, data: IProduct) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: id } });
    if (!product) {
      return { ok: false, error: "Product not found" };
    }

    // Fetch related categories
    const subCategory = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!subCategory) {
      return { ok: false, error: "Sub category not found" };
    }

    await prisma.product.update({
      where: { id: id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        mrp: data.mrp,
        material: data.material,
        productType: data.productType,
        sizeCategory: data.sizeCategory,
        inStock: data.inStock,
        isNewArrival: data.isNewArrival,
        genders: data.genders,
        isBestSeller: false,
        categoryId: data.categoryId,
      },
    });

    // update product colors
    await prisma.productColors.deleteMany({ where: { productId: id } });
    await prisma.productColors.createMany({
      data: data.colors.map((color) => ({
        name: color.name,
        hex: color.hex,
        productId: id,
      })),
    });

    // update product sizes
    await prisma.productSizes.deleteMany({ where: { productId: id } });
    await prisma.productSizes.createMany({
      data: data.sizes.map((size) => ({
        key: size.key,
        value: size.value,
        quantity: size.quantity,
        productColor: size.productColor,
        productId: id,
      })),
    });

    // update product images
    await prisma.productImages.deleteMany({ where: { productId: id } });
    await prisma.productImages.createMany({
      data: data.images.map((image) => ({
        key: image.key,
        url: image.url,
        color: image.color,
        publicId: image.publicId,

        productId: id,
      })),
    });

    // update product attributes
    await prisma.productAttributes.deleteMany({ where: { productId: id } });
    await prisma.productAttributes.createMany({
      data: data.attributes.map((attribute) => ({
        key: attribute.key,
        value: attribute.value,
        productId: id,
      })),
    });

    return { ok: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { ok: false, error: "Product already exists" };
    }

    console.error(error);
    return { ok: false, error: "Something went wrong" };
  }
};

export const deleteProductDB = async (id: string) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: id }, include: { images: true } });
    if (!product) {
      return { ok: false, error: "Product not found" };
    }

    await prisma.collectionProducts.deleteMany({
      where: { productId: id },
    });

    const imagesPublicIds = product.images.map((image) => image.publicId); // to delete images from cloudinary

    await prisma.product.delete({ where: { id: id } });
    return { ok: true, imagesPublicIds: imagesPublicIds.join() };
  } catch (error: any) {
    console.error(error);
    return { ok: false, error: "Something went wrong" };
  }
};
