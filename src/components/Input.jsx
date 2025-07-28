import { useRef, useEffect } from "react";

const Input = ({
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

  // Use useEffect to focus the element after it mounts
  useEffect(() => {
    if (autofocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autofocus]); // Re-run if autofocus prop changes

  if (type === "number" || type === "text" || type === "date") {
    return (
      <div>
        {label && <label className="block text-sm font-medium">{label}</label>}
        <input
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
          className={`w-full rounded-lg border px-3 py-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  if (type === "select") {
    return (
      <div>
        {label && <label className="block text-sm font-medium">{label}</label>}
        <select
          ref={inputRef}
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border px-3 py-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          {...(autofocus ? { autoFocus: true } : {})}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
};

export default Input;
