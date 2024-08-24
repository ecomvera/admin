import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Label } from "../../ui/label";

const Sizes = ({
  control,
  name,
  label,
  value,
  onChange,
}: {
  control: any;
  name: string;
  label: string;
  value: string[];
  onChange: any;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-base text-dark-3">{label}</FormLabel>
          <ToggleGroup variant="outline" type="multiple" onValueChange={onChange} value={value}>
            <ToggleGroupItem value="S" aria-label="Toggle">
              S
            </ToggleGroupItem>
            <ToggleGroupItem value="M" aria-label="Toggle">
              M
            </ToggleGroupItem>
            <ToggleGroupItem value="L" aria-label="Toggle">
              L
            </ToggleGroupItem>
            <ToggleGroupItem value="XL" aria-label="Toggle">
              XL
            </ToggleGroupItem>
            <ToggleGroupItem value="2XL" aria-label="Toggle">
              2XL
            </ToggleGroupItem>
          </ToggleGroup>
          {/* {value?.length === 0 && <Label className="text-base text-red-400">Please select atleast 1 size</Label>} */}
        </FormItem>
      )}
    />
  );
};

export default Sizes;
