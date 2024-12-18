"use client";

import { useFormik } from "formik";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { addWareHouse } from "@/lib/actions/warehouse.action";
import InputField from "./InputField";
import { error, success } from "@/lib/utils";
import { useRouter } from "next/navigation";

const formSchema = Yup.object({
  name: Yup.string().min(3, { message: "Name must be at least 3 characters long" }).required("Name is required"),
  mobile: Yup.string()
    .length(10, { message: "Mobile number must be at least 10 digits long" })
    .required("Mobile number is required"),
  email: Yup.string().email({ message: "Invalid email address" }).required("Email is required"),
  address: Yup.string().min(3, { message: "Address must be at least 3 characters long" }).required("Address is required"),
  city: Yup.string().min(3, { message: "City must be at least 3 characters long" }).required("City is required"),
  state: Yup.string().min(3, { message: "State must be at least 3 characters long" }).required("State is required"),
  country: Yup.string().min(3, { message: "Country must be at least 3 characters long" }).required("Country is required"),
  pincode: Yup.string().min(3, { message: "Pincode must be at least 4 characters long" }).required("Pincode is required"),
});

const CreateWarehousePage = () => {
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: "",
      mobile: "",
      email: "",
      address: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      try {
        formik.isSubmitting = true;
        const res = await addWareHouse(values);
        if (!res?.ok) {
          error(res?.error || "Something went wrong");
          return;
        }

        formik.isSubmitting = false;
        formik.resetForm();
        success("Warehouse added successfully");
        router.push("/warehouses");
      } catch (err) {
        console.error(err);
        error("Something went wrong");
      }
    },
  });

  console.log(formik.errors);

  return (
    <div className="laptop:px-4 max-w-mobile mt-5 sm:mt-2">
      <form onSubmit={formik.handleSubmit} className="space-y-3 mt-0">
        <InputField formik={formik} name="Name" placeholder="Warehouse Name" />
        <InputField formik={formik} name="Mobile" placeholder="Mobile Number" type="number" />
        <InputField formik={formik} name="Email" placeholder="Email" />
        <InputField formik={formik} name="Address" placeholder="Address" />
        <div className="flex gap-4">
          <InputField formik={formik} name="City" placeholder="City" />
          <InputField formik={formik} name="State" placeholder="State" />
        </div>
        <div className="flex gap-4">
          <InputField formik={formik} name="Country" placeholder="Country" />
          <InputField formik={formik} name="Pincode" placeholder="Pincode" type="number" />
        </div>
        <Button type="submit" className="mt-10 rounded" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "adding..." : "Add Warehouse"}
        </Button>
      </form>
    </div>
  );
};

export default CreateWarehousePage;
