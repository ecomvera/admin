"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";
import { productValidation } from "@/lib/validations/product";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ICategory, IImageFile, IKeyValue, IProduct } from "@/types";
import { updateProductDB } from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";
import SizeDetails from "@/components/forms/SizeDetails";
import AttributesInput from "@/components/forms/AttributesInput";
import InputField from "@/components/forms/InputField";
import SelectFields from "@/components/forms/SelectField";
import SwitchField from "@/components/forms/SwitchField";
import ImageContainer from "./ImageContainer";
import { useProductStore } from "@/stores/product";

const EditProduct = ({ categories, product, path }: { categories: ICategory[]; product: IProduct; path: string }) => {
  const { updateProduct } = useProductStore();
  const { toast } = useToast();
  const router = useRouter();
  const [subCategory, setSubCategory] = useState(product.categoryId);
  const [category, setCategory] = useState(product.category?.parent?.id || "");
  const [sizes, setSizes] = useState<IKeyValue[]>(product.sizes);
  const [files, setFiles] = useState<IImageFile[]>(product.images);
  const [colors, setColors] = useState<string[]>(product.colors);
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [attributes, setAttributes] = useState<IKeyValue[]>(product.attributes);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      mrp: product.mrp.toString(),
      material: product.material,
      quantity: product.quantity.toString(),
      inStock: product.inStock,
      isNewArrival: product.isNewArrival,
    },
  });

  const onSubmit = async (values: z.infer<typeof productValidation>) => {
    const res = validateData();
    if (!res?.ok) return;

    setLoading(true);
    const data: IProduct = {
      name: values.name,
      slug: values.name.trim().replace(/\s+/g, "-").toLowerCase(),
      description: values.description,
      price: Number(values.price),
      mrp: Number(values.mrp),
      material: values.material,
      quantity: Number(values.quantity),
      inStock: values.inStock,
      isNewArrival: values.isNewArrival,
      colors,
      sizes,
      attributes,
      images: files,
      categoryId: subCategory,
    };

    const response = await updateProductDB(product.id || "", data);
    if (!response?.ok) {
      toast({
        title: "Error",
        variant: "destructive",
        description: response?.error,
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Success",
      // variant: "success",
      description: "Product created successfully",
    });

    setLoading(false);
    updateProduct(product.id || "", data);
    router.replace(path);
  };

  const validateData = () => {
    if (!sizes.length) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please select the product sizes",
      });
      return;
    }

    if (!attributes.length) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please add some attributes",
      });
      return;
    }

    for (const item of attributes) {
      if (!item.key || !item.value) {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Please fill all the attributes",
        });
        return;
      }
    }

    if (colors.length * 5 !== files.length) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Please upload all the images",
      });
      return;
    }

    return { ok: true };
  };

  useEffect(() => {
    if (category) {
      setSubCategories(categories.find((item) => item.id === category)?.children || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return (
    <>
      <ImageContainer files={files} setFiles={setFiles} colors={colors} setColors={setColors} />

      <Form {...form}>
        <form className="flex flex-col justify-start gap-3 p-2" onSubmit={form.handleSubmit(onSubmit)}>
          <InputField control={form.control} name="name" label="Product Name" />
          <InputField control={form.control} name="description" label="Product Description" textarea />
          <div className="flex gap-3">
            <InputField control={form.control} name="price" label="Price" type="number" />
            <InputField control={form.control} name="mrp" label="MRP" type="number" />
          </div>
          <div className="flex gap-3">
            <SelectFields value={category} onChange={setCategory} data={categories} label="Category" />
            <SelectFields value={subCategory} onChange={setSubCategory} data={subCategories} label="Sub Category" />
          </div>
          <div className="flex gap-3">
            <InputField control={form.control} name="material" label="Material" />
            <InputField control={form.control} name="quantity" label="Quantity" type="number" />
          </div>
          <div className="flex gap-3 flex-col tablet:flex-row">
            <AttributesInput label="Attributes" attributes={attributes} setAttributes={setAttributes} />
            <SizeDetails label="Size Details" sizes={sizes} setSizes={setSizes} />
          </div>
          <div className="w-full flex gap-5">
            <SwitchField control={form.control} name="inStock" label="In Stock" />
            <SwitchField control={form.control} name="isNewArrival" label="New Arrival" />
          </div>

          <Button
            type="submit"
            className={`${loading ? "bg-gray-500" : "bg-gray-700"} rounded-[5px] h-10 text-lg font-semibold my-5`}
          >
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default EditProduct;
