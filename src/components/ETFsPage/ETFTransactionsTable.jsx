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
      "orderDate",
      "units",
      "orderPrice",
      "brokerage",
      "soldUnits",
      "orderValue",
      "livePrice",
      "liveValue",
      "capitalGains$",
      "capitalGains%",
      "remainingUnits",
      "capitalGains",
    ],
    columnFormats: {
      units: "number",
      orderPrice: "currency",
      brokerage: "currency",
      soldUnits: "number",
      orderValue: "currency",
      livePrice: "currency",
      liveValue: "currency",
      capitalGains$: "currency",
      "capitalGains%": "percentage",
      remainingUnits: "number",
      capitalGains: "currency",
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
