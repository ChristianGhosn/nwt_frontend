import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

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
  const [formErrors, setFormErrors] = useState({});

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
    setFormErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors on new submission attempt
    setFormErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      return toast.error("Error submitting form");
    }
    try {
      await dispatch(
        createCashData({
          data: formData,
          getAccessTokenSilently,
        })
      ).unwrap();
      setFormData({ bank: "", balance: 0, currency: "AUD" });
      onClose();
    } catch (rejectedPayload) {
      // Check if the payload is the structured error array from our backend validation
      if (
        Array.isArray(rejectedPayload) &&
        rejectedPayload.every(
          (item) =>
            typeof item === "object" &&
            Object.keys(item).length === 1 &&
            Array.isArray(Object.values(item)[0])
        )
      ) {
        // Transform the array of objects into a single object for easy access by field name
        const transformedErrors = rejectedPayload.reduce(
          (acc, currentErrorObj) => {
            const fieldName = Object.keys(currentErrorObj)[0]; // e.g., 'bank'
            acc[fieldName] = currentErrorObj[fieldName]; // Assign the array of error messages for that field
            return acc;
          },
          {}
        );
        setFormErrors(transformedErrors); // Update the local state with these errors
      } else {
        // It's a generic error message (string) or an unexpected payload.
        console.error("Generic API Error message:", rejectedPayload);
        // Example: set a general error state or use a toast for this:
        toast.error(rejectedPayload || "An unknown error occurred.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({ bank: "", balance: 0, currency: "AUD" });
    setFormErrors({});
    onClose();
  };

  return (
    <PopupDialog isOpen={isOpen} onClose={onClose} title="Add New Bank">
      <NewAccountForm
        formData={formData}
        errors={formErrors}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleCancel={handleCancel}
      />
    </PopupDialog>
  );
};

export default NewBankModal;
