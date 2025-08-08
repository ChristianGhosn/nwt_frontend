import { Field, Label, Input, Description, Select } from "@headlessui/react";
import { useRef, useEffect } from "react";
import clsx from "clsx";

const InputField = ({
  label = false,
  options = [],
  autofocus = false,
  type,
  name,
  value,
  onChange,
  error,
}) => {
  const inputRef = useRef(null);

  const labelClass = "block text-sm font-medium mb-1";
  const errorClass = "mt-1 text-sm text-red-500";
  const inputClass = clsx(
    "block w-full rounded-lg border bg-white/5 px-3 py-1.5 text-sm/6",
    "focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-gray-600",
    error ? "border-red-500" : "border-gray-300"
  );

  // Use useEffect to focus the element after it mounts
  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autofocus]); // Re-run if autofocus prop changes

  if (type === "number" || type === "text" || type === "date") {
    return (
      <Field>
        {label && <Label className={labelClass}>{label}</Label>}
        <Input
          ref={inputRef}
          type={type}
          name={name}
          value={
            type === "number"
              ? value === null || isNaN(value)
                ? ""
                : value
              : value
          }
          onChange={onChange}
          className={inputClass}
        />
        {error && <Description className={errorClass}>{error}</Description>}
      </Field>
    );
  }

  if (type === "select") {
    return (
      <Field>
        {label && <Label className={labelClass}>{label}</Label>}
        <Select
          ref={inputRef}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClass}
        >
          <option value="" disabled hidden>
            --- Select ---
          </option>
          {options.map((option, index) => (
            <option key={index} value={option._id}>
              {option.name}
            </option>
          ))}
        </Select>
        {error && <Description className={errorClass}>{error}</Description>}
      </Field>
    );
  }
};

export default InputField;
