import Table from "../Table";
import { currencies } from "../../constants/currencies";
import { useETFsData } from "../../hooks/useETFsData";
import { useDispatch } from "react-redux";
import {
  deleteTrackedETF,
  updateTrackedETF,
} from "../../store/slices/etfSlice";
import { useAuth0 } from "@auth0/auth0-react";

const ETFsTable = () => {
  const { trackedETFs, loading, error } = useETFsData();
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const config = {
    tableHeading: "ETFs Overview",
    headings: [
      "Ticker",
      "Fund Name",
      "Currency",
      "Live Price",
      "Held Units",
      "Live Value",
      "Average Price",
      "Current Allocation",
      "Target Allocation",
      "Management Fee",
    ],
    keys: [
      "ticker",
      "fund_name",
      "currency",
      "live_price",
      "held_units",
      "live_value",
      "avg_price",
      "current_allocation",
      "target_allocation",
      "management_fee",
    ],
    columnFormats: {
      held_units: "number",
      live_price: "currency",
      live_value: "currency",
      avg_price: "currency",
      target_allocation: "percentage",
      current_allocation: "percentage",
      management_fee: "percentage",
    },
    editableColumns: {
      target_allocation: { type: "number" },
      management_fee: { type: "number" },
    },
    deletableRows: true,
  };

  const handleUpdate = async (id, key, value) => {
    console.log("Updating Table");
    // 1. Get the current object that needs updating
    const currentItem = trackedETFs.find((item) => item._id === id);
    if (!currentItem) return;

    // 2. Create updated object (only the changed field)
    const updatedFields = { [key]: value };

    // 3. Call endpoint to update in backend
    if (updatedFields) {
      try {
        await dispatch(
          updateTrackedETF({
            data: updatedFields,
            documentId: id,
            getAccessTokenSilently,
          })
        ).unwrap();
      } catch (error) {
        console.error("Update failed:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    console.log("Deleting Table Row");
    // 1. Get the current object that needs deleting
    const currentItem = trackedETFs.find((item) => item._id === id);
    if (!currentItem) return;

    // 2. Call endpoint to delete in backend
    await dispatch(
      deleteTrackedETF({
        documentId: id,
        getAccessTokenSilently,
      })
    ).unwrap();
  };

  return (
    <Table
      {...config}
      data={trackedETFs}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      isLoading={loading}
    />
  );
};

export default ETFsTable;
