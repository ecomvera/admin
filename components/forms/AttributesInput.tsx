import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Attributes as AttributeTypes } from "@prisma/client";

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
}

const AttributesInput = ({ label, attributes, setAttributes }: Props) => {
  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {attributes?.map((item, index) => (
        <div className="flex gap-3" key={index}>
          <Input value={item.key} aria-checked className="text-base font-semibold" readOnly />
          <Input
            type="text"
            placeholder="value"
            value={item.value}
            onChange={(e) => {
              const obj = { ...attributes[index], value: e.target.value };
              setAttributes([...attributes.slice(0, index), obj, ...attributes.slice(index + 1)]);
            }}
          />
          <Button
            variant={"outline"}
            className="text-lg p-2 text-red-500 rounded-[5px] font-semibold"
            onClick={() => setAttributes(attributes.filter((k) => k.key !== item.key))}
          >
            X
          </Button>
        </div>
      ))}

      {attributes?.length > 0 && <div className="w-full h-1 bg-gray-200"></div>}

      <Select onValueChange={(field) => setAttributes([...attributes, { key: field, value: "" }])} value="">
        <SelectTrigger className="text-base">
          <SelectValue placeholder={`Select the key`} />
        </SelectTrigger>
        <SelectContent>
          {Object.values(AttributeTypes)
            ?.filter((key) => !attributes.some((selected) => selected.key === key))
            .map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};

export default AttributesInput;
