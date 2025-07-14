import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

const SwitchField = ({ control, name, label }: { control: any; name: string; label: string }) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Card className="border-dashed">
            <CardContent className="flex items-center justify-between p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base font-medium">{label}</FormLabel>
                <div className="text-sm text-muted-foreground">
                  {name === "inStock"
                    ? "Mark this product as available for purchase"
                    : "Highlight this product as a new arrival"}
                </div>
              </div>
              <Switch id={label} checked={field.value} onCheckedChange={field.onChange} />
            </CardContent>
          </Card>
        </FormItem>
      )}
    />
  );
};

export default SwitchField;
