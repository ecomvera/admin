"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "../../ui/button";
import { productValidation } from "@/lib/validations/product";
import { useState } from "react";
import KeyHighlights from "./KeyHighlights";
import Sizes from "./Sizes";
import SelectField from "./SelectField";
import InputField from "./InputField";
import SwitchField from "./SwitchField";
import { useToast } from "@/components/ui/use-toast";
import ImageContainer from "./ImageContainer";

const AddProduct = () => {
  const { toast } = useToast();
  const [sizes, setSizes] = useState([]);
  const [files, setFiles] = useState<{ name: string; value: string }[]>([]);
  const [keyHighlights, setKeyHighlights] = useState<{ key: string; value: string }[]>([]);

  const form = useForm<z.infer<typeof productValidation>>({
    resolver: zodResolver(productValidation),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: "",
      mrp: "",
      parentCategory: "",
      subCategory: "",
      material: "",
      quantity: "",
      inStock: false,
      isNewArrival: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof productValidation>) => {
    const res = validateData();
    if (!res?.ok) return;

    console.log(files);

    console.log({ ...values });
  };

  const validateData = () => {
    if (!sizes.length) {
      toast({
        variant: "destructive",
        title: "Please select the product sizes",
      });
      return;
    }

    if (!keyHighlights.length) {
      toast({
        variant: "success",
        title: "Please add some key highlights",
      });
      return;
    }

    for (const item of keyHighlights) {
      if (!item.key || !item.value) {
        toast({
          variant: "destructive",
          title: "Please fill all key highlights",
        });
        return;
      }
    }

    if (files.length < 5) {
      toast({
        variant: "destructive",
        title: "Please upload all images",
      });
      return;
    }

    return { ok: true };
  };

  return (
    <>
      <Form {...form}>
        <form className="flex flex-col justify-start gap-3 p-2" onSubmit={form.handleSubmit(onSubmit)}>
          <ImageContainer files={files} setFiles={setFiles} />
          <InputField control={form.control} name="name" label="Product Name" />
          <InputField control={form.control} name="slug" label="Product Slug" />
          <InputField control={form.control} name="description" label="Product Description" textarea />
          <div className="flex gap-3">
            <InputField control={form.control} name="price" label="Price" type="number" />
            <InputField control={form.control} name="mrp" label="MRP" type="number" />
          </div>
          <div className="flex gap-3">
            <SelectField control={form.control} name="parentCategory" label="Parent Category" />
            <SelectField control={form.control} name="subCategory" label="Sub Category" />
          </div>
          <div className="flex gap-3">
            <InputField control={form.control} name="material" label="Material" />
            <InputField control={form.control} name="quantity" label="Quantity" type="number" />
          </div>
          <div className="flex gap-3 flex-col tablet:flex-row">
            <KeyHighlights label="Key Highlights" keyHighlights={keyHighlights} setKeyHighlights={setKeyHighlights} />
            <div className="w-full flex flex-col gap-5 desktop:flex-row">
              <Sizes control={form.control} name="sizes" label="Select Sizes" value={sizes} onChange={setSizes} />
              <SwitchField control={form.control} name="inStock" label="In Stock" />
              <SwitchField control={form.control} name="isNewArrival" label="New Arrival" />
            </div>
          </div>

          <Button type="submit" className="bg-success rounded-[5px] h-10 text-lg font-semibold my-5">
            Save
          </Button>
        </form>
      </Form>
    </>
  );
};

export default AddProduct;
