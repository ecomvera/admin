const InputField = ({
  formik,
  name,
  label,
  placeholder,
  type = "text",
}: {
  formik: any;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
}) => {
  return (
    <div className="flex flex-col w-full">
      <label htmlFor={label || name} className="text-sm">
        {name}
      </label>
      <input
        className="border rounded px-2 py-1 text-sm sm:text-[15px] w-full"
        id={label || name.toLowerCase()}
        name={name.toLowerCase()}
        type={type}
        placeholder={placeholder || `Enter ${label || name}`}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[label || name.toLowerCase()]}
      />
      {formik.errors[label || name.toLowerCase()]?.message ||
      (formik.touched[label || name.toLowerCase()] && formik.errors[label || name.toLowerCase()]) ? (
        <div className="text-red-500 text-xs">
          {formik.errors[label || name.toLowerCase()]?.message || formik.errors[label || name.toLowerCase()]}
        </div>
      ) : null}
    </div>
  );
};

export default InputField;
