import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import PopupDialog from "../PopupDialog";
import { createTrackedETF } from "../../store/slices/etfSlice";
import { useAuth0 } from "@auth0/auth0-react";
import NewTickerForm from "./NewTickerForm";

const NewTickerModal = ({ isOpen, onClose }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    ticker: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.ticker || formData.ticker.trim() === "") {
      newErrors.ticker = "Ticker is required";
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
      console.log("Submitting new ticker");

      await dispatch(
        createTrackedETF({
          data: formData,
          getAccessTokenSilently,
        })
      ).unwrap();

      setFormData({ ticker: "" });
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
    setFormData({ ticker: "" });
    setFormErrors({});
    onClose();
  };

  return (
    <PopupDialog isOpen={isOpen} onClose={onClose} title="Add New Ticker">
      <NewTickerForm
        formData={formData}
        errors={formErrors}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleCancel={handleCancel}
      />
    </PopupDialog>
  );
};

export default NewTickerModal;
