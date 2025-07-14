"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { addWareHouse } from "@/lib/actions/warehouse.action";
import InputField from "./InputField";
import { error, success } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Building2, MapPin, Save } from "lucide-react";

const formSchema = Yup.object({
  contactPersonName: Yup.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .required("Contact Person Name is required"),
  contactPersonMobile: Yup.string()
    .length(10, { message: "Mobile number must be at least 10 digits long" })
    .required("Mobile number is required"),
  contactPersonEmail: Yup.string().email({ message: "Invalid email address" }).required("Email is required"),
  warehouseName: Yup.string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .required("Warehouse Name is required"),
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
      contactPersonName: "",
      contactPersonMobile: "",
      contactPersonEmail: "",
      warehouseName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
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
        formik.resetForm();
        success("Warehouse added successfully");
        router.push("/warehouses");
      } catch (err) {
        console.error(err);
        error("Something went wrong");
      } finally {
        formik.isSubmitting = false;
      }
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Contact Information
            </CardTitle>
            <CardDescription>Details of the person responsible for this warehouse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField formik={formik} label="Contact Person Name" name="contactPersonName" placeholder="Enter full name" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                formik={formik}
                label="Mobile Number"
                name="contactPersonMobile"
                placeholder="Enter 10-digit mobile number"
                type="tel"
              />
              <InputField
                formik={formik}
                label="Email Address"
                name="contactPersonEmail"
                placeholder="Enter email address"
                type="email"
              />
            </div>
          </CardContent>
        </Card>

        {/* Warehouse Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Warehouse Details
            </CardTitle>
            <CardDescription>Basic information about the warehouse facility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField
              formik={formik}
              onChange={(e) => formik.setFieldValue("warehouseName", e.target.value.split(" ").join("-").toLowerCase())}
              label="Warehouse Name"
              name="warehouseName"
              placeholder="Enter warehouse identifier name"
            />
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Information
            </CardTitle>
            <CardDescription>Complete address details of the warehouse</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <InputField formik={formik} label="Street Address" name="address" placeholder="Enter complete street address" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField formik={formik} label="City" name="city" placeholder="Enter city name" />
              <InputField formik={formik} label="State/Province" name="state" placeholder="Enter state or province" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField formik={formik} label="Country" name="country" placeholder="Enter country name" />
              <InputField formik={formik} label="Postal/ZIP Code" name="pincode" placeholder="Enter postal code" />
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="pt-6">
            <Button type="submit" disabled={formik.isSubmitting} className="w-full h-12 text-lg font-semibold">
              {formik.isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Warehouse...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Create Warehouse
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default CreateWarehousePage;
