import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IAttribute } from "@/types";

interface Props {
  label: string;
  attributes: {
    key: string;
    value: string;
  }[];
  setAttributes: Dispatch<
    SetStateAction<
      {
        key: string;
        value: string;
      }[]
    >
  >;
  defaultAttributes: IAttribute[];
}

const AttributesInput = ({ label, attributes, setAttributes, defaultAttributes }: Props) => {
  const [selectedSize, setSelectedSize] = useState<string[]>([]);

  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {selectedSize?.map((item, index) => (
        <div className="flex gap-3" key={index}>
          <Input value={item} aria-checked className="text-base font-semibold" readOnly />
          <Select
            onValueChange={(field) => {
              const obj = { key: selectedSize[index], value: field };
              setAttributes([...attributes.slice(0, index), obj, ...attributes.slice(index + 1)]);
            }}
          >
            <SelectTrigger className="text-base">
              <SelectValue placeholder={`Select the value`} />
            </SelectTrigger>
            <SelectContent>
              {defaultAttributes
                .filter((attribute) => attribute.key === item)[0]
                .value.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant={"outline"}
            className="text-lg p-2 text-red-500 rounded-[5px] font-semibold"
            onClick={() => {
              setAttributes(attributes.filter((k) => k.key !== item));
              setSelectedSize(selectedSize.filter((k) => k !== item));
            }}
          >
            X
          </Button>
        </div>
      ))}

      {attributes?.length > 0 && <div className="w-full h-1 bg-gray-200"></div>}

      <Select onValueChange={(field) => setSelectedSize([...selectedSize, field])} value="">
        <SelectTrigger className="text-base">
          <SelectValue placeholder={`Select the key`} />
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
    </FormItem>
  );
};

export default AttributesInput;
