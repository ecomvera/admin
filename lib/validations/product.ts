import * as z from "zod";

export const productValidation = z.object({
  name: z.string().min(3, { message: "Minimum 3 characters." }),
  slug: z.string().min(3, { message: "Minimum 3 characters." }),
  description: z.string().min(3, { message: "Minimum 3 characters." }),
  price: z.string().nonempty({ message: "Please enter the price." }),
  mrp: z.string().nonempty({ message: "Please enter the MRP." }),
  parentCategory: z.string().nonempty({ message: "Please select the parent category." }),
  subCategory: z.string().nonempty({ message: "Please select the sub category." }),
  material: z.string().nonempty({ message: "Please enter the material." }),
  quantity: z.string().nonempty({ message: "Please enter the quantity." }),
  inStock: z.boolean(),
  isNewArrival: z.boolean(),
});
