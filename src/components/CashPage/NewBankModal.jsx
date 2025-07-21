import { useState } from "react";

import NewAccountForm from "./NewAccountForm";
import PopupDialog from "../PopupDialog";

const NewBankModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    bank: "",
    balance: 0,
    currency: "AUD",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bank || formData.bank.trim() === "") {
      newErrors.bank = "Bank name is required";
    } else {
      newErrors.bank = "";
    }
    if (
      formData.balance === "" ||
      formData.balance === null ||
      isNaN(formData.balance)
    ) {
      newErrors.balance = "Balance is required";
    } else {
      newErrors.balance = "";
    }
    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    } else {
      newErrors.currency = "";
    }
    setErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) return;

    onSubmit(formData);
    setFormData({ bank: "", balance: 0, currency: "AUD" });
    onClose();
  };

  const handleCancel = () => {
    setFormData({ bank: "", balance: 0, currency: "AUD" });
    onClose();
  };

  return (
    <PopupDialog isOpen={isOpen} onClose={onClose} title="Add New Bank">
      <NewAccountForm
        formData={formData}
        errors={errors}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleCancel={handleCancel}
      />
    </PopupDialog>
  );
};

export default NewBankModal;
