import Table from "../Table";
import { currencies } from "../../constants/currencies";
import { useETFsData } from "../../hooks/useETFsData";

const ETFsTable = () => {
  const { trackedETFs, loading, error } = useETFsData();
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

  const handleDelete = () => {
    console.log("Deleting Table Row");
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
