"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FaSortDown, FaSortUp } from "react-icons/fa6";
import { MdDeleteOutline } from "react-icons/md";
import { useState } from "react";
import { createAttribute, deleteAttribute } from "@/lib/actions/attribute.action";
import { useToast } from "../ui/use-toast";

const validation = z.object({
  name: z.string().min(3, { message: "Minimum 3 characters." }).max(30, { message: "Maximum 30 caracters." }),
});

const Attributes = ({ attributes }: { attributes: { title: string; _id: string }[] }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof validation>>({
    resolver: zodResolver(validation),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof validation>) => {
    const value = values.name.trim().slice(0, 1).toUpperCase() + values.name.trim().slice(1);

    setLoading(true);
    const res = await createAttribute(value, "/categories");
    setLoading(false);

    if (!res?.ok) {
      toast({
        title: "Error",
        variant: "destructive",
        description: res?.error,
      });
    } else {
      form.reset();
      toast({
        title: "Success",
        // variant: "success",
        description: "Attribute created successfully",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold  text-dark-3  py-8">Add Attribute</h2>

      <Form {...form}>
        <form className="flex flex-col justify-start gap-5 border p-2" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="text-base text-dark-3">Key</FormLabel>
                <FormControl>
                  <Input type="text" className="account-form_input no-focus" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type={loading ? "button" : "submit"} className="bg-dark-3 w-[100px] rounded-xl">
            {loading ? "Adding..." : "Add"}
          </Button>
        </form>
      </Form>

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full">
          <div className="w-full flex justify-between items-center mt-5 pb-1">
            <h2 className="text-xl font-semibold text-dark-3 ">Show all Attributes</h2>
            {open ? <FaSortUp className="text-2xl mt-[1px]" /> : <FaSortDown className="text-2xl mt-[-10px]" />}
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Command>
            <CommandInput placeholder="Type a category or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              {attributes?.map((attribute) => (
                <CommandItem key={attribute._id.toString()} className="flex justify-between items-center">
                  <p>{attribute.title}</p>
                  <MdDeleteOutline
                    className="text-lg cursor-pointer"
                    fill="red"
                    onClick={async () => {
                      await deleteAttribute(attribute._id.toString(), "/categories");
                    }}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Attributes;
