import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useAuth0 } from "@auth0/auth0-react";

import PopupDialog from "../PopupDialog";
import NewTickerForm from "./NewTickerForm";
import { createTrackedETF } from "../../store/slices/etfSlice";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Info } from "lucide-react";

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
      <Popover className="relative">
        <PopoverButton>
          <Info size={16} strokeWidth={1} />
        </PopoverButton>
        <PopoverPanel
          anchor="right"
          className="flex w-48 rounded bg-gray-200 shadow-xl p-4 text-sm/6 transition duration-200 ease-in-out [--anchor-gap:--spacing(1)] data-closed:-translate-y-1 data-closed:opacity-0"
        >
          <p>Ticker must match ticker found in Yahoo Finance</p>
        </PopoverPanel>
      </Popover>
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
