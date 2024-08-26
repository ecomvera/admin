import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Sizes = ({ name, label, onChange }: { name: string; label: string; onChange: any }) => {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="text-base text-dark-3">{label}</FormLabel>
          <ToggleGroup variant="outline" type="multiple" onValueChange={onChange}>
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
        </FormItem>
      )}
    />
  );
};

export default Sizes;
