import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import Table from "../Table";
import { deleteCashData, updateCashData } from "../../store/slices/cashSlice";
import { useCashData } from "../../hooks/useCashData";
import { currencies } from "../../constants/currencies";

const CashTable = () => {
  const { entries, total, loading, error } = useCashData();
  const { user } = useAuth0();
  const dispatch = useDispatch();

  const config = {
    tableHeading: "Cash Overview",
    headings: ["Bank", "Currency", "Balance"],
    keys: ["bank", "currency", "balance"],
    editableColumns: {
      balance: { type: "number" },
      currency: { type: "select", options: currencies },
      bank: { type: "text" },
    },
    deletableRows: true,
  };

  // Delete balance function
  const handleDelete = async ($id) => {
    // 1. Get the current object that needs deleting
    const currentItem = entries.find((item) => item.$id === $id);
    if (!currentItem) return;

    // 2. Call Appwrite to delete the backend
    dispatch(
      deleteCashData({
        documentId: $id,
      })
    );
  };

  // Update balance function
  const handleUpdate = async ($id, key, value) => {
    // 1. Get the current object that needs updating
    const currentItem = entries.find((item) => item.$id === $id);
    if (!currentItem) return;

    // 2. Create updated object (only the changed field)
    const updatedFields = { [key]: value };

    // 3. Call Appwrite to update the backend
    if (updatedFields) {
      dispatch(
        updateCashData({
          data: updatedFields,
          documentId: $id,
          ownerId: user.sub,
        })
      );
    }
  };

  return (
    <div>
      <Table
        {...config}
        data={[...entries, ...(total ? [total] : [])]}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CashTable;
