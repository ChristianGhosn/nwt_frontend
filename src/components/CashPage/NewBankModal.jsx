import { useState } from "react";
import { useDispatch } from "react-redux";

import NewAccountForm from "./NewAccountForm";
import PopupDialog from "../PopupDialog";
import { createCashData } from "../../store/slices/cashSlice";
import { useAuth0 } from "@auth0/auth0-react";

const NewBankModal = ({ isOpen, onClose }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
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
      delete newErrors.bank;
    }
    if (
      formData.balance === "" ||
      formData.balance === null ||
      isNaN(formData.balance)
    ) {
      newErrors.balance = "Balance is required";
    } else {
      delete newErrors.balance;
    }
    if (!formData.currency) {
      newErrors.currency = "Currency is required";
    } else {
      delete newErrors.currency;
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
    if (Object.keys(validationErrors).length > 0) {
      return console.log("Validation Error");
    }
    dispatch(
      createCashData({
        data: formData,
        getAccessTokenSilently,
      })
    );
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
