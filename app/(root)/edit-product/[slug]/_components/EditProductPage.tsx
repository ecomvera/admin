"use client";

import type * as z from "zod";
import useSWR from "swr";
import { fetcher, fetchOpt } from "@/lib/utils";
import { useCategoryStore } from "@/stores/category";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { productValidation } from "@/lib/validations/product";
import { useEffect, useState } from "react";
import type { ICategory, IColor, IImageFile, IProduct, IProductAttribute, IProductSize } from "@/types";
import { updateProductDB } from "@/lib/actions/product.action";
import { useRouter } from "next/navigation";
import SizeDetails from "@/components/forms/SizeDetails";
import AttributesInput from "@/components/forms/AttributesInput";
import InputField from "@/components/forms/InputField";
import SelectFields from "@/components/forms/SelectField";
import SwitchField from "@/components/forms/SwitchField";
import ImageContainer from "@/components/forms/ImageContainer";
import VideoContainer from "@/components/forms/VideoContainer";
import { useProductStore } from "@/stores/product";
import { error, success } from "@/lib/utils";
import GenderInput from "@/components/forms/GenderInput";
import { capitalize } from "lodash";
import SizeCategory from "@/components/forms/SizeCategory";
import { sizeCategories } from "@/constants";
import SelectProductType from "@/components/forms/SelectProductType";
import { useSizes } from "@/hook/useSizes";
import { useColors } from "@/hook/useColors";
import { useTypes } from "@/hook/useTypes";
import WarehouseInput from "@/components/forms/WarehouseInput";
import { useWarehouses } from "@/hook/useWarehouses";
import { Save, ImageIcon, Package, Settings, Warehouse, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EditProductPage = ({ product, searchParams }: { product: IProduct; searchParams: any }) => {
  const { mutate: fetchCategories } = useSWR("/api/categories", fetcher, fetchOpt);
  const { categories, setCategories } = useCategoryStore();
  const { updateProduct } = useProductStore();
  const router = useRouter();
  const { sizes: defaultSizes } = useSizes();
  const { colors: defaultColors } = useColors();
  const { types: defaultTypes } = useTypes();
  const { warehouses: defaultWarehouses } = useWarehouses();

  const [subCategory, setSubCategory] = useState(product.categoryId);
  const [category, setCategory] = useState(product.category?.parent?.id || "");
  // @ts-ignore
  const [productType, setProductType] = useState(product.productType.id || "");
  const [sizeCategory, setSizeCatgory] = useState<string>(product.sizeCategory);
  const [genders, setGenders] = useState<string[]>(product.genders);
  const [sizes, setSizes] = useState<IProductSize[]>(product.sizes);
  const [files, setFiles] = useState<IImageFile[]>(product.images);
  const [colors, setColors] = useState<IColor[]>(product.colors);
  const [attributes, setAttributes] = useState<IProductAttribute[]>(product.attributes);
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [warehouses, setWarehouses] = useState<{ id: string; name: string }[]>([]);
  const [video, setVideo] = useState<string>(product.video || "");
  const [loading, setLoading] = useState(false);
  const [defaultAttributes, setDefaultAttributes] = useState<any[]>([]);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      mrp: product.mrp.toString(),
      material: product.material,
      sku: product.sku,
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
      sku: values.sku,
      slug: values.name.trim().replace(/[|']/g, "").replace(/\s+/g, "-").toLowerCase(),
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
      video: video,
      categoryId: subCategory,
      warehouses: warehouses,
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
    router.replace(searchParams.path || "/products");
  };

  const validateData = () => {
    if (!files.length) return error("Please add some images");
    if (colors.length * 5 !== files.length) return error("Please add all the images");
    if (!warehouses.length) return error("Please add a warehouse");
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

  useEffect(() => {
    const productTypeData = defaultTypes.find((item) => item.id === productType);
    if (productTypeData) {
      setDefaultAttributes(productTypeData.attributes || []);
    }
  }, [productType, defaultTypes]);

  useEffect(() => {
    // @ts-ignore
    setProductType(product.productType.id);
    // @ts-ignore
    setWarehouses(product.warehouses.map((k) => ({ id: k.warehouse.id, name: k.warehouse.warehouseName })));
  }, [product]);

  useEffect(() => {
    const fetch = async () => {
      if (!categories.length) {
        const res = await fetchCategories();
        setCategories(res?.data || []);
      }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-6">
      {/* Alert for editing */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You are editing an existing product. All fields are pre-filled with current data. Make your changes and click
          "Update Product" to save.
        </AlertDescription>
      </Alert>

      {/* Media Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Product Media
          </CardTitle>
          <CardDescription>Update product images and videos to showcase your product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageContainer
            files={files}
            setFiles={setFiles}
            colors={colors}
            setColors={setColors}
            defaultColors={defaultColors}
          />
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
              <CardDescription>Update the basic details about your product</CardDescription>
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
              <CardDescription>Update product categories and types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectFields value={category} onChange={setCategory} isLoading={false} data={categories} label="Category" />
                <SelectFields
                  value={subCategory}
                  onChange={setSubCategory}
                  isLoading={false}
                  data={subCategories}
                  label="Sub Category"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectProductType
                  value={productType}
                  onChange={setProductType}
                  isLoading={false}
                  data={defaultTypes}
                  label="Product Type"
                />
                <SizeCategory
                  value={sizeCategory}
                  onChange={setSizeCatgory}
                  setSizes={setSizes}
                  isLoading={false}
                  data={sizeCategories}
                  label="Size Category"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AttributesInput
                  label="Attributes"
                  attributes={attributes}
                  setAttributes={setAttributes}
                  defaultAttributes={defaultAttributes}
                  productType={productType}
                />
                <GenderInput genders={genders} setGenders={setGenders} />
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
              <CardDescription>Update warehouse locations and size details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WarehouseInput
                  label="Warehouse"
                  warehouses={warehouses}
                  setWarehouses={setWarehouses}
                  defaultWarehouses={defaultWarehouses}
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
            </CardContent>
          </Card>

          {/* Product Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Product Settings
              </CardTitle>
              <CardDescription>Configure product availability and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-6">
                <SwitchField control={form.control} name="inStock" label="In Stock" />
                <SwitchField control={form.control} name="isNewArrival" label="New Arrival" />
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
                    Updating Product...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    Update Product
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

export default EditProductPage;
