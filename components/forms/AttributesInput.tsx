"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import type { IAttribute, IProductAttribute } from "@/types";
import { Plus, X, Settings } from "lucide-react";

interface Props {
  label: string;
  attributes: IProductAttribute[];
  setAttributes: Dispatch<SetStateAction<IProductAttribute[]>>;
  defaultAttributes: IAttribute[];
  productType: string;
}

const AttributesInput = ({ label, attributes, setAttributes, defaultAttributes, productType }: Props) => {
  const [selectedSize, setSelectedSize] = useState<string[]>([...attributes.map((i) => i.key)]);

  useEffect(() => {
    if (attributes.length === 0) setSelectedSize([]);
  }, [attributes]);

  return (
    <FormItem className="flex w-full flex-col space-y-3">
      <FormLabel className="text-base font-medium">{label}</FormLabel>

      {defaultAttributes.length === 0 && !productType && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-3">
            <p className="text-sm text-amber-700">Please select the product type first.</p>
          </CardContent>
        </Card>
      )}

      {defaultAttributes.length === 0 && productType && (
        <Card className="border-gray-200">
          <CardContent className="flex items-center justify-center py-6">
            <div className="text-center">
              <Settings className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No attributes available for this product type</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {selectedSize?.map((item, index) => (
          <div className="flex gap-2" key={index}>
            <Input value={item} className="text-sm font-medium bg-gray-50" readOnly />
            <Select
              value={attributes[index]?.value}
              onValueChange={(field) => {
                const obj = { key: selectedSize[index], value: field };
                setAttributes([...attributes.slice(0, index), obj, ...attributes.slice(index + 1)]);
              }}
            >
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select value" />
              </SelectTrigger>
              <SelectContent>
                {defaultAttributes
                  ?.filter((attribute) => attribute.key === item)[0]
                  ?.value?.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 bg-transparent"
              onClick={() => {
                setAttributes(attributes.filter((k) => k.key !== item));
                setSelectedSize(selectedSize.filter((k) => k !== item));
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {defaultAttributes.length !== selectedSize.length && (
          <Select
            onValueChange={(field) => {
              setAttributes([...attributes, { key: field, value: "" }]);
              setSelectedSize([...selectedSize, field]);
            }}
            value=""
          >
            <SelectTrigger className="text-base border-dashed">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <SelectValue placeholder="Add attribute" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {defaultAttributes
                ?.filter((attribute) => !attributes.some((selected) => selected.key === attribute.key))
                .map((item) => (
                  <SelectItem key={item.key} value={item.key}>
                    {item.key}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </FormItem>
  );
};

export default AttributesInput;
