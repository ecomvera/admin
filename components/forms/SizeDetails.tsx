import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IColor, IProductSize, ISize } from "@/types";

interface Props {
  label: string;
  colors: IColor[];
  sizes: IProductSize[];
  setSizes: Dispatch<SetStateAction<IProductSize[]>>;
  defaultSizes: ISize[];
  sizeCategory: string;
}

const SizeDetails = ({ label, colors, sizes, setSizes, defaultSizes, sizeCategory }: Props) => {
  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>

      {colors?.map((color, index) => (
        <div className="flex gap-3 flex-col pb-2" key={index}>
          <p className="border-l-8 pl-2" style={{ borderColor: color.hex }}>
            Sizes for color {color.name}
          </p>

          {sizes
            ?.filter((i) => i.productColor === color.hex)
            .map((item, index) => (
              <div className="flex gap-3" key={index}>
                <Input value={item.key} aria-checked className="text-base font-semibold w-14" readOnly />
                <Input
                  type="number"
                  className="text-base w-16 placeholder:text-sm p-1"
                  placeholder="Qnt."
                  defaultValue={item.quantity === 0 ? "" : item.quantity}
                  onChange={(e) => {
                    const objIndex = sizes.findIndex((k) => k.key === item.key && k.productColor === item.productColor);
                    const obj = {
                      key: sizes[objIndex].key,
                      value: sizes[objIndex].value,
                      quantity: Number(e.target.value),
                      productColor: sizes[objIndex].productColor,
                    };
                    setSizes([...sizes.slice(0, objIndex), obj, ...sizes.slice(objIndex + 1)]);
                  }}
                />
                <Input
                  defaultValue={item.value}
                  className="w-full text-base placeholder:text-xs placeholder:font-normal"
                  type="text"
                  placeholder="Chest (in Inch): 43.0 | Front Length (in Inch): 28.0 | Sleeve Length (in Inch): 9.75"
                  onChange={(e) => {
                    const objIndex = sizes.findIndex((k) => k.key === item.key && k.productColor === item.productColor);
                    const obj = {
                      key: sizes[objIndex].key,
                      quantity: sizes[objIndex].quantity,
                      value: e.target.value,
                      productColor: sizes[objIndex].productColor,
                    };
                    setSizes([...sizes.slice(0, objIndex), obj, ...sizes.slice(objIndex + 1)]);
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

          {/* {sizes?.length > 0 && <div className="w-full h-1 bg-gray-200"></div>} */}

          <Select
            onValueChange={(value) => setSizes([...sizes, { key: value, quantity: 0, value: "", productColor: color.hex }])}
            value=""
          >
            <SelectTrigger className="text-base">
              <SelectValue placeholder={`Select the Size`} />
            </SelectTrigger>
            <SelectContent>
              {defaultSizes
                ?.find((item) => item.type === sizeCategory)
                ?.value?.filter((item) => !sizes.some((size) => size.key === item && size.productColor === color.hex))
                .map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </FormItem>
  );
};

export default SizeDetails;
