import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction } from "react";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { IAttribute } from "@/types";

interface Props {
  label: string;
  sizes: { key: string; value: string }[];
  setSizes: Dispatch<
    SetStateAction<
      {
        key: string;
        value: string;
      }[]
    >
  >;
}

const defaultSizes = ["S", "M", "L", "XL", "2XL"];

const SizeDetails = ({ label, sizes, setSizes }: Props) => {
  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {sizes?.map((item, index) => (
        <div className="flex gap-3" key={index}>
          <Input value={item.key} aria-checked className="text-base font-semibold w-16" readOnly />
          <Input
            className="w-full text-base placeholder:text-xs placeholder:font-normal"
            type="text"
            placeholder="Chest (in Inch): 43.0 | Front Length (in Inch): 28.0 | Sleeve Length (in Inch): 9.75"
            onChange={(e) => {
              const obj = { key: defaultSizes[index], value: e.target.value };
              setSizes([...sizes.slice(0, index), obj, ...sizes.slice(index + 1)]);
            }}
          />
          <Button
            variant={"outline"}
            className="text-lg p-2 text-red-500 rounded-[5px] font-semibold"
            onClick={() => setSizes(sizes.filter((k) => k.key !== item.key))}
          >
            X
          </Button>
        </div>
      ))}

      {sizes?.length > 0 && <div className="w-full h-1 bg-gray-200"></div>}

      <Select onValueChange={(field) => setSizes([...sizes, { key: field, value: "" }])} value="">
        <SelectTrigger className="text-base">
          <SelectValue placeholder={`Select the Size`} />
        </SelectTrigger>
        <SelectContent>
          {defaultSizes
            ?.filter((a) => !sizes.some((k) => k.key === a))
            .map((a) => (
              <SelectItem key={a} value={a}>
                {a}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};

export default SizeDetails;
