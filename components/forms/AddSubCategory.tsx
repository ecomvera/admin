import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const validation = z.object({
  name: z.string().min(3, { message: "Minimum 3 characters." }).max(30, { message: "Maximum 30 caracters." }),
  parentCategory: z.string().nonempty({ message: "Please select the parent category." }),
});

const AddSubCategory = () => {
  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      name: "",
      parentCategory: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof validation>) => {
    console.log("values", values);
  };

  return (
    <Form {...form}>
      <form className="flex flex-col justify-start gap-5 border p-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="parentCategory"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="text-base">
                <SelectValue placeholder="Select the parent category" />
              </SelectTrigger>
              <FormMessage />
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="text-base text-dark-3">Sub-Category Name</FormLabel>
              <FormControl>
                <Input type="text" className="account-form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-dark-3 w-[100px] rounded-xl">
          Add
        </Button>
      </form>
    </Form>
  );
};

export default AddSubCategory;
