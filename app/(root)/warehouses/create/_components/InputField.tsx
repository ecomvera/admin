"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const InputField = ({
  formik,
  value,
  onChange,
  name,
  label,
  placeholder,
  type = "text",
}: {
  formik: any;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  label: string;
  placeholder?: string;
  type?: string;
}) => {
  const fieldName = name || label.toLowerCase().replace(/\s+/g, "");
  const hasError = formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldName} className="text-sm font-medium">
        {label}
      </Label>
      <Input
        id={fieldName}
        name={fieldName}
        type={type}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        onChange={onChange || formik.handleChange}
        onBlur={formik.handleBlur}
        value={value || formik.values[fieldName] || ""}
        className={hasError ? "border-red-500 focus:border-red-500" : ""}
      />
      {hasError && <p className="text-sm text-red-500">{formik.errors[fieldName]?.message || formik.errors[fieldName]}</p>}
    </div>
  );
};

export default InputField;
