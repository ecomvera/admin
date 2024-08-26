import * as z from "zod";

export const productValidation = z
  .object({
    name: z.string().min(3, { message: "Minimum 3 characters." }),
    description: z.string().min(3, { message: "Minimum 3 characters." }),
    price: z.string().nonempty({ message: "Please enter the price." }),
    mrp: z.string().nonempty({ message: "Please enter the MRP." }),
    material: z.string().nonempty({ message: "Please enter the material." }),
    quantity: z.string().nonempty({ message: "Please enter the quantity." }),
    inStock: z.boolean(),
    isNewArrival: z.boolean(),
  })
  .refine((data) => Number(data.mrp) > Number(data.price), {
    message: "MRP should be greater than price.",
    path: ["mrp"],
  });
