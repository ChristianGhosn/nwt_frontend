import { useState } from "react";
import Table from "../components/Table";

const Cash = () => {
  const [data, setData] = useState({
    Cash: {
      tableHeading: "Cash Overview",
      headings: ["Bank", "Currency", "Balance"],
      keys: ["bank", "currency", "balance"],
      data: [
        {
          id: 1,
          bank: "Cash Savings",
          currency: "USD",
          balance: 0.0,
        },
        {
          id: 2,
          bank: "Emergency Fund",
          currency: "USD",
          balance: 0.0,
        },
        {
          id: 3,
          bank: "Other Cash Holdings",
          currency: "USD",
          balance: 0.0,
        },
        { id: 4, bank: "Total Balance", currency: "USD", balance: 0.0 },
      ],
    },
  });
  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Cash</h1>
      <Table
        tableHeading={data.Cash.tableHeading}
        headings={data.Cash.headings}
        keys={data.Cash.keys}
        data={data.Cash.data}
        editableColumnKey={"balance"}
      />
    </div>
  );
};

export default Cash;
