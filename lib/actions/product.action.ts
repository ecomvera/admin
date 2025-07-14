"use server";

import { IProduct } from "@/types";
import { prisma } from "../prisma";

export const createProduct = async (product: IProduct) => {
  try {
    // const category = await prisma.category.findUnique({ where: { id: product.categoryId } });
    // if (!category) {
    //   return { ok: false, error: "Category not found" };
    // }

    const res = await prisma.$transaction(async (prisma) => {
      const data = await prisma.product.create({
        data: {
          name: product.name,
          sku: product.sku,
          slug: product.slug,
          description: product.description,
          price: product.price,
          mrp: product.mrp,
          material: product.material,
          productTypeId: product.productType,
          sizeCategory: product.sizeCategory,
          genders: product.genders,
          categoryId: product.categoryId,
          video: product.video,
          isNewArrival: true,
        },
      });

      // create product attributes
      await prisma.productAttributes.createMany({
        data: product.attributes.map((attribute) => ({
          key: attribute.key,
          value: attribute.value,
          productId: data.id,
        })),
      });

      // add product to warehouseproducts
      await prisma.wareHouseProducts.createMany({
        data: product.warehouses.map((warehouse) => ({
          productId: data.id,
          warehouseId: warehouse.id,
        })),
      });

      // create product colors
      await prisma.productColors.createMany({
        data: product.colors.map((color) => ({
          name: color.name,
          hex: color.hex,
          productId: data.id,
        })),
      });

      // create product sizes
      await prisma.productSizes.createMany({
        data: product.sizes.map((size) => ({
          key: size.key,
          value: size.value,
          quantity: size.quantity,
          productColor: size.productColor,
          productId: data.id,
        })),
      });

      // create product images
      await prisma.productImages.createMany({
        data: product.images.map((image) => ({
          key: image.key,
          url: image.url,
          color: image.color,
          publicId: image.publicId,

          productId: data.id,
        })),
      });

      // // create product attributes
      // await prisma.productAttributes.createMany({
      //   data: product.attributes.map((attribute) => ({
      //     key: attribute.key,
      //     value: attribute.value,
      //     productId: data.id,
      //   })),
      // });

      return data;
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
    // First, fetch the existing product with all related data
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
      include: {
        warehouses: true,
        colors: true,
        sizes: true,
        images: true,
        attributes: true,
      },
    });

    if (!existingProduct) {
      return { ok: false, error: "Product not found" };
    }

    await prisma.$transaction(async (prisma) => {
      // Update main product fields only if they've changed
      const productUpdates: any = {};

      if (existingProduct.name !== data.name) productUpdates.name = data.name;
      if (existingProduct.slug !== data.slug) productUpdates.slug = data.slug;
      if (existingProduct.description !== data.description) productUpdates.description = data.description;
      if (existingProduct.price !== data.price) productUpdates.price = data.price;
      if (existingProduct.mrp !== data.mrp) productUpdates.mrp = data.mrp;
      if (existingProduct.material !== data.material) productUpdates.material = data.material;
      if (existingProduct.productTypeId !== data.productType) productUpdates.productTypeId = data.productType;
      if (existingProduct.sizeCategory !== data.sizeCategory) productUpdates.sizeCategory = data.sizeCategory;
      if (existingProduct.inStock !== data.inStock) productUpdates.inStock = data.inStock;
      if (existingProduct.isNewArrival !== data.isNewArrival) productUpdates.isNewArrival = data.isNewArrival;
      if (existingProduct.categoryId !== data.categoryId) productUpdates.categoryId = data.categoryId;

      // Compare genders array
      const existingGenders = existingProduct.genders || [];
      const newGenders = data.genders || [];
      if (JSON.stringify(existingGenders.sort()) !== JSON.stringify(newGenders.sort())) {
        productUpdates.genders = data.genders;
      }

      // Only update if there are changes
      if (Object.keys(productUpdates).length > 0) {
        await prisma.product.update({
          where: { id: id },
          data: productUpdates,
        });
      }

      // Update warehouses only if changed
      const existingWarehouseIds = existingProduct.warehouses.map((w) => w.warehouseId).sort();
      const newWarehouseIds = data.warehouses.map((w) => w.id).sort();

      if (JSON.stringify(existingWarehouseIds) !== JSON.stringify(newWarehouseIds)) {
        await prisma.wareHouseProducts.deleteMany({ where: { productId: id } });
        if (data.warehouses.length > 0) {
          await prisma.wareHouseProducts.createMany({
            data: data.warehouses.map((warehouse) => ({
              productId: id,
              warehouseId: warehouse.id,
            })),
          });
        }
      }

      // Update product colors only if changed
      const existingColors = existingProduct.colors.map((c) => ({ name: c.name, hex: c.hex }));
      const newColors = data.colors.map((c) => ({ name: c.name, hex: c.hex }));

      if (JSON.stringify(existingColors) !== JSON.stringify(newColors)) {
        await prisma.productColors.deleteMany({ where: { productId: id } });
        if (data.colors.length > 0) {
          await prisma.productColors.createMany({
            data: data.colors.map((color) => ({
              name: color.name,
              hex: color.hex,
              productId: id,
            })),
          });
        }
      }

      // Update product sizes only if changed
      const existingSizes = existingProduct.sizes.map((s) => ({
        key: s.key,
        value: s.value,
        quantity: s.quantity,
        productColor: s.productColor,
      }));
      const newSizes = data.sizes.map((s) => ({
        key: s.key,
        value: s.value,
        quantity: s.quantity,
        productColor: s.productColor,
      }));

      if (JSON.stringify(existingSizes) !== JSON.stringify(newSizes)) {
        await prisma.productSizes.deleteMany({ where: { productId: id } });
        if (data.sizes.length > 0) {
          await prisma.productSizes.createMany({
            data: data.sizes.map((size) => ({
              key: size.key,
              value: size.value,
              quantity: size.quantity,
              productColor: size.productColor,
              productId: id,
            })),
          });
        }
      }

      // Update product images only if changed
      const existingImages = existingProduct.images.map((i) => ({
        key: i.key,
        url: i.url,
        color: i.color,
        publicId: i.publicId,
      }));
      const newImages = data.images.map((i) => ({
        key: i.key,
        url: i.url,
        color: i.color,
        publicId: i.publicId,
      }));

      if (JSON.stringify(existingImages) !== JSON.stringify(newImages)) {
        await prisma.productImages.deleteMany({ where: { productId: id } });
        if (data.images.length > 0) {
          await prisma.productImages.createMany({
            data: data.images.map((image) => ({
              key: image.key,
              url: image.url,
              color: image.color,
              publicId: image.publicId,
              productId: id,
            })),
          });
        }
      }

      // Update product attributes only if changed
      if (data.attributes && data.attributes.length > 0) {
        const existingAttributes =
          existingProduct.attributes?.map((a) => ({
            key: a.key,
            value: a.value,
          })) || [];
        const newAttributes = data.attributes.map((a) => ({
          key: a.key,
          value: a.value,
        }));

        if (JSON.stringify(existingAttributes) !== JSON.stringify(newAttributes)) {
          await prisma.productAttributes.deleteMany({ where: { productId: id } });
          await prisma.productAttributes.createMany({
            data: data.attributes.map((attribute) => ({
              key: attribute.key,
              value: attribute.value,
              productId: id,
            })),
          });
        }
      } else if (existingProduct.attributes && existingProduct.attributes.length > 0) {
        // If no new attributes but existing ones exist, delete them
        await prisma.productAttributes.deleteMany({ where: { productId: id } });
      }

      // Handle video update if provided
      if (data.video !== undefined) {
        if (existingProduct.video !== data.video) {
          await prisma.product.update({
            where: { id: id },
            data: { video: data.video },
          });
        }
      }
    });

    return { ok: true };
  } catch (error: any) {
    console.log("Update error:", error.message);
    if (error.code === "P2002") {
      return { ok: false, error: "Product with this name or slug already exists" };
    }
    console.error("Product update error:", error);
    return { ok: false, error: "Something went wrong while updating the product" };
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
