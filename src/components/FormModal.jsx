// components/FormModal.jsx
import { useState } from "react";
import { Fieldset, Legend } from "@headlessui/react";
import PopupDialog from "./PopupDialog";
import InputField from "./Input";
import Button from "./Button";

const FormModal = ({ isOpen, onClose, title, config }) => {
  const [formData, setFormData] = useState(() =>
    config.inputs.reduce((acc, input) => {
      acc[input.name] = input.defaultValue ?? "";
      return acc;
    }, {})
  );

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
    }));
  };

  const handleCancel = () => {
    setFormErrors({});
    setFormData(() =>
      config.inputs.reduce((acc, input) => {
        acc[input.name] = input.defaultValue ?? "";
        return acc;
      }, {})
    );
    config.onCancel?.();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = config.validate ? config.validate(formData) : {};
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    config.onSubmit?.(formData);
    setFormErrors({});
    onClose();
  };

  return (
    <PopupDialog isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit}>
        <Fieldset className="space-y-4 rounded-xl p-4 sm:p-6">
          <Legend className="text-base/7 font-semibold">{title}</Legend>
          {config.inputs.map((input, idx) => (
            <InputField
              key={input.name}
              type={input.type}
              label={input.label}
              name={input.name}
              value={formData[input.name]}
              options={input.options}
              autofocus={idx === 0 && input.autofocus}
              error={formErrors[input.name]}
              onChange={handleChange}
            />
          ))}
          <div className="flex items-center justify-end gap-2">
            <Button type="button" onClick={handleCancel}>
              {config.cancelLabel || "Cancel"}
            </Button>
            <Button type="submit">{config.submitLabel || "Submit"}</Button>
          </div>
        </Fieldset>
      </form>
    </PopupDialog>
  );
};

export default FormModal;
