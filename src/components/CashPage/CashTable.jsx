import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import Table from "../Table";
import { deleteCashData, updateCashData } from "../../store/slices/cashSlice";
import { useCashData } from "../../hooks/useCashData";
import { currencies } from "../../constants/currencies";

const CashTable = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { data: entries = [], total, loading, error } = useCashData();
  const dispatch = useDispatch();

  const config = {
    tableHeading: "Cash Overview",
    headings: ["Bank", "Currency", "Balance"],
    keys: ["bank", "currency", "balance"],
    columnFormats: {
      balance: "currency",
    },
    editableColumns: {
      balance: { type: "number" },
      currency: { type: "select", options: currencies },
      bank: { type: "text" },
    },
    deletableRows: true,
  };

  // Delete balance function
  const handleDelete = async (id) => {
    // 1. Get the current object that needs deleting
    const currentItem = entries.find((item) => item._id === id);
    if (!currentItem) return;

    // 2. Call endpoint to delete in backend
    await dispatch(
      deleteCashData({
        documentId: id,
        getAccessTokenSilently,
      })
    ).unwrap();
  };

  // Update balance function
  const handleUpdate = async (id, key, value) => {
    // 1. Get the current object that needs updating
    const currentItem = entries.find((item) => item._id === id);
    if (!currentItem) return;

    // 2. Create updated object (only the changed field)
    const updatedFields = { [key]: value };

    // 3. Call endpoint to update in backend
    if (updatedFields) {
      try {
        // Dispatch the update thunk. toast.promise (inside thunk) handles showing feedback.
        // .unwrap() will re-throw the rejected value if the update fails (e.g., validation error).
        await dispatch(
          updateCashData({
            data: updatedFields,
            documentId: id,
            getAccessTokenSilently,
          })
        ).unwrap();
      } catch (error) {
        // This catch block will be hit if updateCashData.unwrap() throws an error.
        // The toast.promise inside updateCashData thunk has already shown a general error message.
        // You don't need to display a separate message here unless you want additional local handling.
        console.error("Update failed:", error);
        // Stay in edit mode, or exit based on your UX preference
        // setEditingColumn(null); // Option: exit edit mode anyway
      }
    }
  };

  return (
    <Table
      {...config}
      data={[...entries, ...(total ? [total] : [])]}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      isLoading={loading}
    />
  );
};

export default CashTable;
