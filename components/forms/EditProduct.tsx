"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";
import { productValidation } from "@/lib/validations/product";
import { useEffect, useState } from "react";
import { ICategory, IColor, IImageFile, IProduct, IProductAttribute, IProductSize } from "@/types";
import { updateProductDB } from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";
import SizeDetails from "@/components/forms/SizeDetails";
import AttributesInput from "@/components/forms/AttributesInput";
import InputField from "@/components/forms/InputField";
import SelectFields from "@/components/forms/SelectField";
import SwitchField from "@/components/forms/SwitchField";
import ImageContainer from "./ImageContainer";
import { useProductStore } from "@/stores/product";
import { error, success } from "@/lib/utils";
import GenderInput from "./GenderInput";
import { capitalize } from "lodash";
import SizeCategory from "./SizeCategory";
import { sizeCategories } from "@/constants";
import SelectProductType from "./SelectProductType";
import { useSizes } from "@/hook/useSizes";
import { useColors } from "@/hook/useColors";
import { useAttributes } from "@/hook/useAttributes";
import { useTypes } from "@/hook/useTypes";

const EditProduct = ({ categories, product, path }: { categories: ICategory[]; product: IProduct; path: string }) => {
  const { updateProduct } = useProductStore();
  const router = useRouter();
  const { sizes: defaultSizes } = useSizes();
  const { colors: defaultColors } = useColors();
  const { attributes: defaultAttributes } = useAttributes();
  const { types: defaultTypes } = useTypes();
  const [subCategory, setSubCategory] = useState(product.categoryId);
  const [category, setCategory] = useState(product.category?.parent?.id || "");
  const [productType, setProductType] = useState(product.productType);
  const [sizeCategory, setSizeCatgory] = useState<string>(product.sizeCategory);
  const [genders, setGenders] = useState<string[]>(product.genders);
  const [sizes, setSizes] = useState<IProductSize[]>(product.sizes);
  const [files, setFiles] = useState<IImageFile[]>(product.images);
  const [colors, setColors] = useState<IColor[]>(product.colors);
  const [attributes, setAttributes] = useState<IProductAttribute[]>(product.attributes);
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      mrp: product.mrp.toString(),
      material: product.material,
      inStock: product.inStock,
      isNewArrival: product.isNewArrival,
    },
  });

  const onSubmit = async (values: z.infer<typeof productValidation>) => {
    const res = validateData();
    // @ts-ignore
    if (!res?.ok) return;

    setLoading(true);
    const data: IProduct = {
      name: capitalize(values.name.trim()),
      slug: values.name.trim().replace(/\s+/g, "-").toLowerCase(),
      description: values.description,
      price: Number(values.price),
      mrp: Number(values.mrp),
      material: capitalize(values.material),
      productType: productType,
      sizeCategory: sizeCategory,
      inStock: values.inStock,
      isNewArrival: values.isNewArrival,
      genders,
      colors,
      sizes,
      attributes,
      images: files,
      categoryId: subCategory,
    };

    const response = await updateProductDB(product.id || "", data);
    if (!response?.ok) {
      error(response?.error || "Something went wrong");
      setLoading(false);
      return;
    }

    success("Product updated successfully");
    setLoading(false);
    updateProduct(product.id || "", data);
    setProductType("");
    router.replace(path);
  };

  const validateData = () => {
    if (!files.length) return error("Please add some images");
    if (colors.length * 5 !== files.length) return error("Please add all the images");
    if (!category) return error("Please select the product category");
    if (!subCategory) return error("Please select the product sub category");
    if (!sizes.length) return error("Please select the product sizes");
    for (const item of sizes) {
      if (!item.key || !item.quantity) return error("Please fill all fields in size.");
    }
    if (!attributes.length) return error("Please add some attributes");
    return { ok: true };
  };

  useEffect(() => {
    if (category) {
      setSubCategories(categories.find((item) => item.id === category)?.children || []);
    }
  }, [category]);

  useEffect(() => {
    setSubCategory(product.categoryId);
    setCategory(product.category?.parent?.id || "");
    setProductType(product.productType);
    setSizeCatgory(product.sizeCategory);
    setGenders(product.genders);
    setSizes(product.sizes);
    setFiles(product.images);
    setColors(product.colors);
    setAttributes(product.attributes);
  }, [product]);

  return (
    <>
      <ImageContainer
        files={files}
        setFiles={setFiles}
        colors={colors}
        setColors={setColors}
        defaultColors={defaultColors}
      />

      <Form {...form}>
        <form className="flex flex-col justify-start gap-3 p-2" onSubmit={form.handleSubmit(onSubmit)}>
          <InputField control={form.control} name="name" label="Product Name" />
          <InputField control={form.control} name="description" label="Product Description" textarea />
          <div className="flex gap-3">
            <InputField control={form.control} name="price" label="Price" type="number" />
            <InputField control={form.control} name="mrp" label="MRP" type="number" />
          </div>
          <SelectProductType
            value={productType}
            onChange={setProductType}
            isLoading={false}
            data={defaultTypes}
            label="Product Type"
          />
          <div className="flex gap-3">
            <SelectFields value={category} onChange={setCategory} data={categories} label="Category" />
            <SelectFields value={subCategory} onChange={setSubCategory} data={subCategories} label="Sub Category" />
          </div>
          <div className="flex gap-3">
            <SizeCategory
              value={sizeCategory}
              onChange={setSizeCatgory}
              setSizes={setSizes}
              isLoading={false}
              data={sizeCategories}
              label="Size Category"
            />
            <SizeDetails
              label="Size Details"
              sizes={sizes}
              setSizes={setSizes}
              sizeCategory={sizeCategory}
              defaultSizes={defaultSizes.filter((item) => item.type === sizeCategory)}
            />
          </div>
          <div className="flex gap-3 flex-col tablet:flex-row">
            <div className="flex gap-3 w-full">
              <InputField control={form.control} name="material" label="Material" />
              <GenderInput genders={genders} setGenders={setGenders} />
            </div>
            <AttributesInput
              label="Attributes"
              attributes={attributes}
              setAttributes={setAttributes}
              defaultAttributes={defaultAttributes}
            />
          </div>
          <div className="w-full flex gap-5">
            <SwitchField control={form.control} name="inStock" label="In Stock" />
            <SwitchField control={form.control} name="isNewArrival" label="New Arrival" />
          </div>

          <Button
            type="submit"
            className={`${loading ? "bg-gray-500" : "bg-gray-700"} rounded-[5px] h-10 text-lg font-semibold my-5`}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditProduct;
