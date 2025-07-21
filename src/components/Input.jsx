const Input = ({
  label = false,
  options = [],
  type,
  name,
  value,
  onChange,
  error,
}) => {
  if (type === "number" || type === "text") {
    return (
      <div>
        {label && <label className="block text-sm font-medium">{label}</label>}
        <input
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
          name={name}
          value={value}
          onChange={onChange}
          className={`w-full rounded-lg border px-3 py-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
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
