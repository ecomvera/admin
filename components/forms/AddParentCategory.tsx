import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const validation = z.object({
  name: z.string().min(3, { message: "Minimum 3 characters." }).max(30, { message: "Maximum 30 caracters." }),
});

const AddParentCategory = () => {
  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      name: "",
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
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="text-base text-dark-3">Category Name</FormLabel>
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

export default AddParentCategory;
