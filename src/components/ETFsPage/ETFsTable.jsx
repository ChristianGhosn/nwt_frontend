import Table from "../Table";
import { currencies } from "../../constants/currencies";
import { useETFsData } from "../../hooks/useETFsData";
import { useDispatch } from "react-redux";
import { deleteTrackedETF } from "../../store/slices/etfSlice";
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
    editableColumns: {
      ticker: { type: "text" },
      currency: { type: "select", options: currencies },
    },
    deletableRows: true,
  };

  const handleUpdate = () => {
    console.log("Updating Table");
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
    />
  );
};

export default ETFsTable;
