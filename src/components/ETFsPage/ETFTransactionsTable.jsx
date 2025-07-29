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
      "Order Value",
      "Live Price",
      "Live Value",
      "Capital Gain ($)",
      "Capital Gain (%)",
    ],
    keys: [
      "action",
      "ticker",
      "order_date",
      "units",
      "order_price",
      "brokerage",
      "order_value",
      "live_price",
      "live_value",
      "capital_gains_$",
      "capital_gains_%",
    ],
    columnFormats: {
      units: "number",
      order_price: "currency",
      brokerage: "currency",
      order_value: "currency",
      live_price: "currency",
      live_value: "currency",
      capital_gains_$: "currency",
      "capital_gains_%": "percentage",
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
