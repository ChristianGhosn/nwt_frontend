import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";

import PopupDialog from "../PopupDialog";
import NewETFTransactionForm from "./NewETFTransactionForm";
import { createEtfTransaction } from "../../store/slices/etfSlice";
import BuySellSwitch from "../BuySellSwitch";

const NewETFTransactionModal = ({ isOpen, onClose }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const [action, setAction] = useState(true);
  const [formData, setFormData] = useState({
    action: "buy",
    ticker: "",
    orderDate: "",
    units: 0,
    orderPrice: 0,
    brokerage: 0,
  });
  const [formErrors, setFormErrors] = useState({});

  const handleSwitchChange = (newActionValue) => {
    setAction(newActionValue); // Update the local 'action' state
    setFormData((prevFormData) => ({
      ...prevFormData,
      action: newActionValue ? "buy" : "sell", // Update 'action' in formData
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ticker || formData.ticker.trim() === "") {
      newErrors.ticker = "Ticker is required";
    }

    if (!formData.orderDate || formData.orderDate.trim() === "") {
      newErrors.orderDate = "Date is required";
    }

    if (
      formData.units === "" ||
      formData.units === null ||
      isNaN(formData.units)
    ) {
      newErrors.units = "Units required";
    }

    if (formData.units <= 0) {
      newErrors.units = "Units must be greater than 0.";
    }

    if (
      formData.orderPrice === "" ||
      formData.orderPrice === null ||
      isNaN(formData.orderPrice)
    ) {
      newErrors.orderPrice = "Order Price is required";
    }

    if (
      formData.brokerage === "" ||
      formData.brokerage === null ||
      isNaN(formData.brokerage)
    ) {
      newErrors.brokerage = "Brokerage fee is required";
    }
    setFormErrors(newErrors);
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) : value,
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
        createEtfTransaction({ data: formData, getAccessTokenSilently })
      ).unwrap();

      setFormData({
        action: "buy",
        ticker: "",
        orderDate: "",
        units: 0,
        orderPrice: 0,
        brokerage: 0,
      });
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
    setFormData({
      action: "buy",
      ticker: "",
      orderDate: "",
      units: 0,
      orderPrice: 0,
      brokerage: 0,
    });
    setFormErrors({});
    onClose();
  };

  return (
    <PopupDialog isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <div className="flex justify-center items-center mt-2">
        <BuySellSwitch action={action} setAction={handleSwitchChange} />
      </div>
      <NewETFTransactionForm
        formData={formData}
        errors={formErrors}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleCancel={handleCancel}
      />
    </PopupDialog>
  );
};

export default NewETFTransactionModal;
