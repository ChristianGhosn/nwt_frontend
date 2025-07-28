import Table from "../Table";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";

import { useEtfTransactions } from "../../hooks/useEtfTransactions";

const ETFTransactionsTable = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { data = [], loading, error } = useEtfTransactions();
  const dispatch = useDispatch();
  const config = {
    tableHeading: "ETF Transactions",
    headings: [
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
    editableColumns: {
      order_date: { type: "date" },
      units: { type: "number" },
      order_price: { type: "number" },
      brokerage: { type: "number" },
    },
    deletableRows: true,
  };

  const handleUpdate = async (id, key, value) => {
    console.log("Handling Update...");
  };

  const handleDelete = async (id) => {
    console.log("Handling Delete...");
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
