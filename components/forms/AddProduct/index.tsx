"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "../../ui/button";
import { productValidation } from "@/lib/validations/product";
import { useEffect, useRef, useState } from "react";
import SelectField from "./SelectField";
import InputField from "./InputField";
import SwitchField from "./SwitchField";
import { useToast } from "@/components/ui/use-toast";
import { IAttribute, ICategory, IProduct } from "@/types";
import AttributesInput from "./AttributesInput";
import { createProduct } from "@/lib/actions/product.action";
import ImagesGrid from "./ImagesGrid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useFileStore, useProductStore } from "@/stores/product";
// @ts-ignore
import { isEqual } from "lodash";
import ImageContainer from "./ImageContainer";
import SizeDetails from "./SizeDetails";

interface Props {
  categories: {
    data: ICategory[];
    isLoading: boolean;
  };
  attributesData: {
    data: IAttribute[];
    isLoading: boolean;
  };
}

const AddProduct = ({ categories, attributesData }: Props) => {
  const router = useRouter();
  const { toast } = useToast();
  const { files, setFiles, colors, setColors } = useFileStore();
  const { product, setProduct } = useProductStore();
  const [sizes, setSizes] = useState<{ key: string; value: string }[]>([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState<ICategory[]>([]);
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: product,
  });

  const images = [
    {
      key: "image1",
      color: "#ffffff",
      url: "https://via.placeholder.com/300x300",
      publicId: "image1",
    },
    {
      key: "image2",
      color: "#ffffff",
      url: "https://via.placeholder.com/300x300",
      publicId: "image2",
    },
    {
      key: "image3",
      color: "#ffffff",
      url: "https://via.placeholder.com/300x300",
      publicId: "image3",
    },
    {
      key: "image4",
      color: "#ffffff",
      url: "https://via.placeholder.com/300x300",
      publicId: "image4",
    },
    {
      key: "image5",
      color: "#ffffff",
      url: "https://via.placeholder.com/300x300",
      publicId: "image5",
    },
  ];

  const formData = form.watch();
  // useRef to store previous formData to avoid infinite loop
  const prevFormData = useRef(formData);

  const onSubmit = async (values: z.infer<typeof productValidation>) => {
    // const res = validateData();
    // if (!res?.ok) return;

    // setLoading(true);
    const data: IProduct = {
      name: values.name,
      slug: values.name.trim().replace(/\s+/g, "-").toLowerCase(),
      description: values.description,
      price: Number(values.price),
      mrp: Number(values.mrp),
      category: category,
      subCategory: subCategory,
      images: images,
      sizes: sizes,
      attributes: attributes,
      material: values.material,
      quantity: Number(values.quantity),
      inStock: values.inStock,
      isNewArrival: values.isNewArrival,
    };
    // console.log(data);

    const response = await createProduct(data);
    // if (!response?.ok) {
    //   toast({
    //     title: "Error",
    //     variant: "destructive",
    //     description: response?.error,
    //   });

    //   setLoading(false);
    //   return;
    // }

    // toast({
    //   title: "Success",
    //   // variant: "success",
    //   description: "Product created successfully",
    //   action: (
    //     <Link href={`/products`}>
    //       <Button variant="outline" size="sm" className="rounded-xl font-semibold text-black">
    //         View
    //       </Button>
    //     </Link>
    //   ),
    // });

    // form.reset();
    // setLoading(false);
    // setSizes([]);
    // setCategory("");
    // setSubCategory("");
    // setSubCategories([]);
    // setAttributes([]);
    // setFiles([]);
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

    if (files.length !== 5) {
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
      setSubCategories(categories.data.find((item) => item._id === category)?.children || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    if (!isEqual(prevFormData.current, formData)) {
      setProduct(formData);
      prevFormData.current = formData;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <>
      <ImageContainer files={files} setFiles={setFiles} colors={colors} setColors={setColors} />

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
          <div className="flex gap-3">
            <InputField control={form.control} name="material" label="Material" />
            <InputField control={form.control} name="quantity" label="Quantity" type="number" />
          </div>
          <div className="flex gap-3 flex-col tablet:flex-row">
            <AttributesInput
              label="Attributes"
              attributes={attributes}
              setAttributes={setAttributes}
              isLoading={attributesData.isLoading}
              attributesData={attributesData.data}
            />
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

export default AddProduct;
