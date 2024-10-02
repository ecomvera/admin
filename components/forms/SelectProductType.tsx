import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dispatch, SetStateAction } from "react";
import { ICategory } from "@/types";

const SelectProductType = ({
  value,
  onChange,
  data,
  label,
  isLoading = false,
}: {
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  data: string[];
  label: string;
  isLoading?: boolean;
}) => {
  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel className="text-base text-dark-3">{label}</FormLabel>
      <Select onValueChange={(v) => onChange(v)} value={value}>
        <SelectTrigger className="text-base">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select"} />
        </SelectTrigger>
        <SelectContent>
          {data?.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
};

export default SelectProductType;
