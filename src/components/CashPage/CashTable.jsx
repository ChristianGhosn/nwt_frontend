import Table from "../Table";
import { updateCashData } from "../../store/slices/cashSlice";
import { useCashData } from "../../hooks/useCashData";

const CashTable = () => {
  const { entries, total, loading, error } = useCashData();

  const config = {
    tableHeading: "Cash Overview",
    headings: ["Bank", "Currency", "Balance"],
    keys: ["bank", "currency", "balance"],
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
        editableColumnKey={"balance"}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default CashTable;
