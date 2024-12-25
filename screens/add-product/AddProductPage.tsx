"use client";

import AttributesInput from "@/components/forms/AttributesInput";
import GenderInput from "@/components/forms/GenderInput";
import ImageContainer from "@/components/forms/ImageContainer";
import InputField from "@/components/forms/InputField";
import SelectFields from "@/components/forms/SelectField";
import SelectProductType from "@/components/forms/SelectProductType";
import SizeCategory from "@/components/forms/SizeCategory";
import SizeDetails from "@/components/forms/SizeDetails";
import SwitchField from "@/components/forms/SwitchField";
import WarehouseInput from "@/components/forms/WarehouseInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { sizeCategories } from "@/constants";
import { useAttributes } from "@/hook/useAttributes";
import { useCategories } from "@/hook/useCategories";
import { useColors } from "@/hook/useColors";
import { useSizes } from "@/hook/useSizes";
import { useTypes } from "@/hook/useTypes";
import { useWarehouses } from "@/hook/useWarehouses";
import { createProduct } from "@/lib/actions/product.action";
import { error, success } from "@/lib/utils";
import { productValidation } from "@/lib/validations/product";
import { addProductState } from "@/stores/add-product-state";
import { useFileStore, useProductStore } from "@/stores/product";
import { ICategory, IProduct, IProductAttribute, IProductSize } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize, isEqual, set } from "lodash";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AddProductPage = () => {
  const { warehouses: defaultWarehouses, fetchWarehouseLoading } = useWarehouses();
  const { categories, fetchCategoriesLoading } = useCategories();
  const { sizes: defaultSizes, fetchingSizes } = useSizes();
  const { colors: defaultColors, fetchingColors } = useColors();
  const { attributes: defaultAttributes, fetchingAttributes } = useAttributes();
  const { types: defaultTypes, fetchingTypes } = useTypes();
  const { files, setFiles, colors, setColors } = useFileStore();
  const { addProduct } = useProductStore();
  const { formData: fcs, setFormData } = addProductState();
  // fcs -> form control state

  const [genders, setGenders] = useState<string[]>(fcs.genders || []);
  const [sizeCategory, setSizeCatgory] = useState<string>(fcs.sizeCategory || "");
  const [sizes, setSizes] = useState<IProductSize[]>(fcs.sizes || []);
  const [warehouses, setWarehouses] = useState<{ id: string; quantity: number; name: string }[]>(fcs.warehouses || []);
  const [productType, setProductType] = useState(fcs.productType || "");
  const [category, setCategory] = useState(fcs.category || "");
  const [subCategory, setSubCategory] = useState(fcs.subCategory || "");
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [attributes, setAttributes] = useState<IProductAttribute[]>(fcs.attributes || []);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: fcs,
  });

  // storing form current state
  const formData = form.watch();
  const prevFormData = useRef(formData); // useRef to store previous formData to avoid infinite loop
  useEffect(() => {
    if (!isEqual(prevFormData.current, formData)) {
      // @ts-ignore
      setFormData(formData);
      prevFormData.current = formData;
    }
  }, [formData]);
  useEffect(() => {
    // @ts-ignore
    setFormData({ ...formData, genders, sizeCategory, sizes, warehouses, productType, category, subCategory, attributes });
  }, [genders, sizeCategory, sizes, warehouses, productType, category, subCategory, attributes]);
  // end

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
      warehouses: warehouses,
      productType: productType,
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
    setGenders([]);
    setWarehouses([]);
  };

  const validateData = () => {
    if (!files.length) return error("Please add some images");
    if (colors.length * 5 !== files.length) return error("Please add all the images");
    if (!warehouses.length) return error("Please add a warehouse");
    for (const item of warehouses) {
      if (!item.quantity) return error("Please fill all the warehouse quantity");
    }
    if (!category) return error("Please select the product category");
    if (!subCategory) return error("Please select the product sub category");
    if (!sizes.length) return error("Please select the product sizes");
    for (const item of sizes) {
      if (!item.key || !item.quantity || !item.value) return error("Please fill all fields in size.");
    }
    if (!genders.length) return error("Please select at least one gender");
    for (const item of attributes) {
      if (!item.key || !item.value) return error("Please fill all fields in attributes.");
    }

    return { ok: true };
  };

  useEffect(() => {
    if (category) {
      setSubCategories(categories.find((item) => item.id === category)?.children || []);
    }
  }, [category]);

  return (
    <div className="p-2">
      <ImageContainer
        files={files}
        setFiles={setFiles}
        colors={colors}
        setColors={setColors}
        defaultColors={defaultColors}
      />

      <Form {...form}>
        <form className="flex flex-col justify-start gap-3 mt-5" onSubmit={form.handleSubmit(onSubmit)}>
          <InputField control={form.control} name="name" label="Product Name" />
          <InputField control={form.control} name="description" label="Product Description" textarea />
          <div className="flex gap-3">
            <InputField control={form.control} name="price" label="Price" type="number" />
            <InputField control={form.control} name="mrp" label="MRP" type="number" />
          </div>
          <div className="flex flex-col mobile:flex-row gap-3">
            <WarehouseInput
              label="Warehouse"
              warehouses={warehouses}
              setWarehouses={setWarehouses}
              defaultWarehouses={defaultWarehouses}
            />
            <SelectProductType
              value={productType}
              onChange={setProductType}
              isLoading={fetchingTypes}
              data={defaultTypes}
              label="Product Type"
            />
          </div>
          <div className="flex flex-col mobile:flex-row gap-3">
            <SelectFields
              value={category}
              onChange={setCategory}
              isLoading={fetchCategoriesLoading}
              data={categories}
              label="Category"
            />
            <SelectFields
              value={subCategory}
              onChange={setSubCategory}
              isLoading={fetchCategoriesLoading}
              data={subCategories}
              label="Sub Category"
            />
          </div>
          <div className="flex gap-3 flex-col tablet:flex-row">
            <SizeCategory
              value={sizeCategory}
              onChange={setSizeCatgory}
              setSizes={setSizes}
              isLoading={fetchCategoriesLoading}
              data={sizeCategories}
              label="Size Category"
            />
            <SizeDetails
              label="Size Details"
              colors={colors}
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
    </div>
  );
};

export default AddProductPage;
