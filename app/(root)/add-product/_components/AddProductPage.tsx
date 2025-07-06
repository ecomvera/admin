"use client";

import AttributesInput from "@/components/forms/AttributesInput";
import GenderInput from "@/components/forms/GenderInput";
import ImageContainer from "@/components/forms/ImageContainer";
import InputField from "@/components/forms/InputField";
import SelectFields from "@/components/forms/SelectField";
import SelectProductType from "@/components/forms/SelectProductType";
import SizeCategory from "@/components/forms/SizeCategory";
import SizeDetails from "@/components/forms/SizeDetails";
import VideoContainer from "@/components/forms/VideoContainer";
import WarehouseInput from "@/components/forms/WarehouseInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { sizeCategories } from "@/constants";
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
import type { IAttribute, ICategory, IProduct } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { capitalize } from "lodash";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Save, ImageIcon, Package, Settings, Warehouse } from "lucide-react";

const AddProductPage = () => {
  const { warehouses: defaultWarehouses, fetchWarehouseLoading } = useWarehouses();
  const { categories, fetchCategoriesLoading } = useCategories();
  const { sizes: defaultSizes, fetchingSizes } = useSizes();
  const { colors: defaultColors, fetchingColors } = useColors();
  const [defaultAttributes, setDefaultAttributes] = useState<IAttribute[]>([]);
  const { types: defaultTypes, fetchingTypes } = useTypes();
  const { files, setFiles, colors, setColors, video, setVideo } = useFileStore();
  const { addProduct } = useProductStore();
  const { formData, setFormData } = addProductState();
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: formData,
  });

  const onSubmit = async (values: z.infer<typeof productValidation>) => {
    const res = validateData();
    // @ts-ignore
    if (!res?.ok) return;

    setLoading(true);
    const data: IProduct = {
      name: capitalize(values.name),
      sku: values.sku,
      slug: values.name.trim().replace(/[|']/g, "").replace(/\s+/g, "-").toLowerCase(),
      description: values.description,
      price: Number(values.price),
      mrp: Number(values.mrp),
      material: capitalize(values.material),
      genders: formData.genders,
      colors: colors,
      warehouses: formData.warehouses,
      productType: formData.productType,
      sizeCategory: formData.sizeCategory,
      sizes: formData.sizes,
      images: files,
      video: video,
      attributes: formData.attributes,
      categoryId: formData.subCategory,
    };

    const response = await createProduct(data);
    if (!response?.ok) {
      error(response?.error || "Something went wrong");
      setLoading(false);
      return;
    }

    addProduct({ id: response.productId, ...data });
    setLoading(false);
    form.reset();
    setFormData({
      name: "",
      description: "",
      price: "",
      mrp: "",
      material: "",
      weight: "",
      hasDeliveryFee: false,
      inStock: false,
      isNewArrival: false,
      genders: [],
      sizeCategory: "",
      sizes: [],
      warehouses: [],
      productType: "",
      category: "",
      subCategory: "",
      attributes: [],
    });
    setSubCategories([]);
    setFiles([]);
    setColors([]);
    setVideo("");
    success(
      "Product created successfully",
      "default",
      <Link href={`/p/${data?.slug}`}>
        <Button variant="outline" size="sm" className="rounded-xl font-semibold text-black bg-transparent">
          View
        </Button>
      </Link>
    );
  };

  const validateData = () => {
    if (!files.length) return error("Please add some images");
    if (colors.length * 5 !== files.length) return error("Please add all the images");
    if (!formData.warehouses.length) return error("Please add a warehouse");
    if (!formData.category) return error("Please select the product category");
    if (!formData.subCategory) return error("Please select the product sub category");
    if (!formData.sizes.length) return error("Please select the product sizes");
    for (const item of formData.sizes) {
      if (!item.key || !item.quantity || !item.value) return error("Please fill all fields in size.");
    }
    if (!formData.genders.length) return error("Please select at least one gender");
    for (const item of formData.attributes) {
      if (!item.key || !item.value) return error("Please fill all fields in attributes.");
    }
    return { ok: true };
  };

  useEffect(() => {
    if (formData.category) {
      setSubCategories(categories.find((item) => item.id === formData.category)?.children || []);
    }
  }, [formData.category]);

  useEffect(() => {
    const productType = formData.productType;
    if (productType) {
      setFormData({ ...formData, attributes: [] });
      setDefaultAttributes(defaultTypes.find((item) => item.id === productType)?.attributes || []);
    }
  }, [formData.productType]);

  return (
    <div className="space-y-6">
      {/* Media Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Product Media
          </CardTitle>
          <CardDescription>Upload product images and videos to showcase your product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageContainer colors={colors} setColors={setColors} defaultColors={defaultColors} />
          <Separator />
          <VideoContainer video={video} setVideo={setVideo} />
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Enter the basic details about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InputField control={form.control} name="name" label="Product Name" placeholder="Enter product name" />
              <InputField
                control={form.control}
                name="description"
                label="Product Description"
                placeholder="Enter product description"
                textarea
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  control={form.control}
                  name="price"
                  label="Price"
                  type="number"
                  placeholder="Enter price (Rs.)"
                />
                <InputField control={form.control} name="mrp" label="MRP" type="number" placeholder="Enter MRP (Rs.)" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField control={form.control} name="material" label="Material" placeholder="Enter product material" />
                <InputField
                  control={form.control}
                  name="sku"
                  label="SKU (Stock Keeping Unit)"
                  placeholder="Enter product SKU"
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories & Classification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Categories & Classification
              </CardTitle>
              <CardDescription>Organize your product with categories and types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectFields
                  value={formData.category}
                  onChange={(data: any) => setFormData({ ...formData, category: data })}
                  isLoading={fetchCategoriesLoading}
                  data={categories}
                  label="Category"
                />
                <SelectFields
                  value={formData.subCategory}
                  onChange={(data: any) => setFormData({ ...formData, subCategory: data })}
                  isLoading={fetchCategoriesLoading}
                  data={subCategories}
                  label="Sub Category"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectProductType
                  value={formData.productType}
                  onChange={(data: any) => setFormData({ ...formData, productType: data })}
                  isLoading={fetchingTypes}
                  data={defaultTypes}
                  label="Product Type"
                />
                <SizeCategory
                  value={formData.sizeCategory}
                  onChange={(data: any) => setFormData({ ...formData, sizeCategory: data })}
                  setSizes={(data: any) => setFormData({ ...formData, sizes: data })}
                  isLoading={fetchCategoriesLoading}
                  data={sizeCategories}
                  label="Size Category"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AttributesInput
                  label="Attributes"
                  attributes={formData.attributes}
                  setAttributes={(data: any) => setFormData({ ...formData, attributes: data })}
                  defaultAttributes={defaultAttributes}
                  productType={formData.productType}
                />
                <GenderInput
                  genders={formData.genders}
                  setGenders={(data: any) => setFormData({ ...formData, genders: data })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Inventory & Sizes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Inventory & Sizes
              </CardTitle>
              <CardDescription>Manage warehouse locations and size details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WarehouseInput
                  label="Warehouse"
                  warehouses={formData.warehouses}
                  setWarehouses={(data: any) => setFormData({ ...formData, warehouses: data })}
                  defaultWarehouses={defaultWarehouses}
                />
                <SizeDetails
                  label="Size Details"
                  colors={colors}
                  sizes={formData.sizes}
                  setSizes={(data: any) => setFormData({ ...formData, sizes: data })}
                  sizeCategory={formData.sizeCategory}
                  defaultSizes={defaultSizes.filter((item) => item.type === formData.sizeCategory)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Product...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    Create Product
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default AddProductPage;
