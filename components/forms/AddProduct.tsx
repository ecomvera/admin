"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "../ui/button";
import { productValidation } from "@/lib/validations/product";
import { useEffect, useRef, useState } from "react";
import SelectField from "./SelectField";
import InputField from "./InputField";
import SwitchField from "./SwitchField";
import { useToast } from "@/components/ui/use-toast";
import { ICategory, IProduct, IProductAttribute, IProductSize } from "@/types";
import AttributesInput from "./AttributesInput";
import { createProduct } from "@/lib/actions/product.action";
import Link from "next/link";
import { useFileStore, useProductStore } from "@/stores/product";
import ImageContainer from "./ImageContainer";
import SizeDetails from "./SizeDetails";
import { useEnums } from "@/hook/useEnums";
import { error, success } from "@/lib/utils";
import GenderInput from "./GenderInput";
import { capitalize } from "lodash";
import { sizeCategories } from "@/constants";
import SizeCategory from "./SizeCategory";
import { useEnumsStore } from "@/stores/enums";

interface Props {
  categories: {
    data: ICategory[];
    isLoading: boolean;
  };
}

const AddProduct = ({ categories }: Props) => {
  const { sizes: defaultSizes, colors: defaultColors, attributes: defaultAttributes } = useEnumsStore();
  const { files, setFiles, colors, setColors } = useFileStore();
  const { addProduct } = useProductStore();

  const [genders, setGenders] = useState<string[]>([]);
  const [sizeCategory, setSizeCatgory] = useState<string>("");
  const [sizes, setSizes] = useState<IProductSize[]>([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [attributes, setAttributes] = useState<IProductAttribute[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      mrp: "",
      material: "",
      inStock: false,
      isNewArrival: false,
    },
  });

  // const formData = form.watch();
  // // useRef to store previous formData to avoid infinite loop
  // const prevFormData = useRef(formData);

  const onSubmit = async (values: z.infer<typeof productValidation>) => {
    const res = validateData();
    // @ts-ignore
    if (!res?.ok) return;

    setLoading(true);
    const data: IProduct = {
      name: capitalize(values.name),
      slug: values.name.trim().replace(/\s+/g, "-").toLowerCase(),
      description: values.description,
      price: Number(values.price),
      mrp: Number(values.mrp),
      material: capitalize(values.material),
      inStock: values.inStock,
      isNewArrival: values.isNewArrival,
      genders: genders,
      colors: colors,
      sizeCategory: sizeCategory,
      sizes: sizes,
      images: files,
      attributes: attributes,
      categoryId: subCategory,
    };

    const response = await createProduct(data);
    if (!response?.ok) {
      error(response?.error || "Something went wrong");
      setLoading(false);
      return;
    }

    addProduct({ id: response.productId, ...data });
    success(
      "Product created successfully",
      "default",
      <Link href={`/p/${data?.slug}`}>
        <Button variant="outline" size="sm" className="rounded-xl font-semibold text-black">
          View
        </Button>
      </Link>
    );

    setLoading(false);
    form.reset();
    setSizes([]);
    setCategory("");
    setSubCategory("");
    setSubCategories([]);
    setAttributes([]);
    setFiles([]);
    setColors([]);
  };

  const validateData = () => {
    if (!files.length) return error("Please add some images");
    if (colors.length * 5 !== files.length) return error("Please add all the images");
    if (!category) return error("Please select the product category");
    if (!subCategory) return error("Please select the product sub category");
    if (!sizes.length) return error("Please select the product sizes");
    for (const item of sizes) {
      if (!item.key || !item.quantity || !item.value) return error("Please fill all fields in size.");
    }
    if (!genders.length) return error("Please select at least one gender");
    if (!attributes.length) return error("Please add some attributes");
    return { ok: true };
  };

  useEffect(() => {
    if (category) {
      setSubCategories(categories.data.find((item) => item.id === category)?.children || []);
    }
  }, [category]);

  // useEffect(() => {
  //   if (!isEqual(prevFormData.current, formData)) {
  //     setProduct(formData);
  //     prevFormData.current = formData;
  //   }
  // }, [formData]);

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
        <form className="flex flex-col justify-start gap-3 p-2 mt-5" onSubmit={form.handleSubmit(onSubmit)}>
          <InputField control={form.control} name="name" label="Product Name" />
          <InputField control={form.control} name="description" label="Product Description" textarea />
          <div className="flex gap-3">
            <InputField control={form.control} name="price" label="Price" type="number" />
            <InputField control={form.control} name="mrp" label="MRP" type="number" />
          </div>
          <div className="flex gap-3">
            <SelectField
              value={category}
              onChange={setCategory}
              isLoading={categories.isLoading}
              data={categories.data}
              label="Category"
            />
            <SelectField
              value={subCategory}
              onChange={setSubCategory}
              isLoading={categories.isLoading}
              data={subCategories}
              label="Sub Category"
            />
          </div>
          <div className="flex gap-3 flex-col tablet:flex-row">
            <SizeCategory
              value={sizeCategory}
              onChange={setSizeCatgory}
              setSizes={setSizes}
              isLoading={categories.isLoading}
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
            {loading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddProduct;
