// components/NewBudgetItemForm.jsx
import FormModal from "../FormModal";
import { budgetCategories } from "../../constants/budgetCategories";
import { createBudgetItem } from "../../store/slices/budgetSlice";

import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

const NewBudgetItemForm = ({ isOpen, onClose, budget, cashAccounts }) => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();
  const tabs =
    budget?.tabs.map((tab) => ({ _id: tab?._id, name: tab?.name })) || [];
  const accounts =
    cashAccounts.map((acc) => ({ _id: acc._id, name: acc.bank })) || [];

  const formConfig = {
    submitLabel: "Add Item",
    cancelLabel: "Cancel",
    onSubmit: async (data) => {
      await dispatch(
        createBudgetItem({
          data,
          getAccessTokenSilently,
        })
      ).unwrap();
    },
    inputs: [
      {
        name: "tab",
        label: "Tab",
        type: "select",
        options: tabs,
        defaultValue: "",
        autofocus: true,
      },
      {
        name: "item",
        label: "Item",
        type: "text",
        defaultValue: "",
      },
      {
        name: "monthly",
        label: "Monthly",
        type: "number",
        defaultValue: 0,
      },
      {
        name: "bankAccount",
        label: "Bank Account",
        type: "select",
        options: accounts,
        defaultValue: "",
      },
      {
        name: "category",
        label: "Category",
        type: "select",
        options: budgetCategories,
        defaultValue: "",
      },
    ],
    validate: (data) => {
      const errors = {};
      if (!data.tab) errors.tab = "Tab is required";
      if (!data.item) errors.item = "Item name is required";
      if (!data.monthly || data.monthly < 0)
        errors.monthly = "Enter a valid amount";
      if (!data.bankAccount) errors.bankAccount = "Bank Account is required";
      if (!data.category) errors.category = "Category is required";
      return errors;
    },
  };

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="New Budget Item"
      config={formConfig}
    />
  );
};

export default NewBudgetItemForm;
