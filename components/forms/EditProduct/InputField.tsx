import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";

const InputField = ({
  control,
  name,
  label,
  type = "text",
  textarea = false,
}: {
  control: any;
  name: string;
  label: string;
  type?: string;
  textarea?: boolean;
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel className="text-base text-dark-3">{label}</FormLabel>
          <FormControl>
            {textarea ? (
              <Textarea placeholder="Describe your product" rows={5} {...field} />
            ) : (
              <Input type={type} className="" {...field} />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default InputField;
