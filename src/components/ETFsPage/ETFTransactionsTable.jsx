import Table from "../Table";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { useEtfTransactions } from "../../hooks/useEtfTransactions";
import { deleteEtfTransaction } from "../../store/slices/etfSlice";

const ETFTransactionsTable = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { data = [], loading, error } = useEtfTransactions();
  const dispatch = useDispatch();
  const config = {
    tableHeading: "ETF Transactions",
    headings: [
      "Action",
      "Ticker",
      "Order Date",
      "Units",
      "Order Price (AUD)",
      "Brokerage",
      "Sold Units",
      "Order Value",
      "Live Price",
      "Live Value",
      "Capital Gain ($)",
      "Capital Gain (%)",
      "Remaining Units",
      "Capital Gains",
    ],
    keys: [
      "action",
      "ticker",
      "order_date",
      "units",
      "order_price",
      "brokerage",
      "sold_units",
      "order_value",
      "live_price",
      "live_value",
      "capital_gains_$",
      "capital_gains_%",
      "remaining_units",
      "capital_gains",
    ],
    columnFormats: {
      units: "number",
      order_price: "currency",
      brokerage: "currency",
      sold_units: "number",
      order_value: "currency",
      live_price: "currency",
      live_value: "currency",
      capital_gains_$: "currency",
      "capital_gains_%": "percentage",
      remaining_units: "number",
      capital_gains: "currency",
    },
    deletableRows: true,
  };

  const handleUpdate = async (id, key, value) => {
    console.log("Handle Update not implemented...");
  };

  const handleDelete = async (id) => {
    console.log("Handling Delete...");
    // 1. Get the current object that need deleting
    const currentItem = data.find((item) => item._id === id);

    // 2. Call endpoint to delete in backend
    await dispatch(
      deleteEtfTransaction({ documentId: id, getAccessTokenSilently })
    ).unwrap();
  };

  return (
    <Table
      {...config}
      data={data}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      isLoading={loading}
    />
  );
};

export default ETFTransactionsTable;
