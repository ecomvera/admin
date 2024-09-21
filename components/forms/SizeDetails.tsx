import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IKeyValue, ISize } from "@/types";

interface Props {
  label: string;
  sizes: IKeyValue[];
  setSizes: Dispatch<SetStateAction<IKeyValue[]>>;
  defaultSizes: ISize[];
}

const SizeDetails = ({ label, sizes, setSizes, defaultSizes }: Props) => {
  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {sizes?.map((item, index) => (
        <div className="flex gap-3" key={index}>
          <Input value={item.key} aria-checked className="text-base font-semibold w-14" readOnly />
          <Input
            type="number"
            className="text-base w-16 placeholder:text-sm p-1"
            placeholder="Qnt."
            defaultValue={item.quantity}
            onChange={(e) => {
              const obj = { key: sizes[index].key, value: sizes[index].value, quantity: Number(e.target.value) };
              setSizes([...sizes.slice(0, index), obj, ...sizes.slice(index + 1)]);
            }}
          />
          <Input
            defaultValue={item.value}
            className="w-full text-base placeholder:text-xs placeholder:font-normal"
            type="text"
            placeholder="Chest (in Inch): 43.0 | Front Length (in Inch): 28.0 | Sleeve Length (in Inch): 9.75"
            onChange={(e) => {
              const obj = { key: sizes[index].key, quantity: sizes[index].quantity, value: e.target.value };
              setSizes([...sizes.slice(0, index), obj, ...sizes.slice(index + 1)]);
            }}
          />
          <Button
            type="button"
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
            ?.filter((item) => !sizes.some((selected) => selected.key === item.value))
            .map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.value}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};

export default SizeDetails;
