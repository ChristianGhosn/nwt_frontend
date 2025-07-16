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
          bank: "Cash Savings",
          currency: "USD",
          balance: 0.0,
        },
        {
          bank: "Emergency Fund",
          currency: "USD",
          balance: 0.0,
        },
        {
          bank: "Other Cash Holdings",
          currency: "USD",
          balance: 0.0,
        },
        { bank: "Total Balance", currency: "USD", balance: 0.0 },
      ],
    },
  });
  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">{data.Cash.tableHeading}</h1>
      <Table
        tableHeading={data.Cash.tableHeading}
        data={data.Cash.data}
        keys={data.Cash.keys}
        headings={data.Cash.headings}
      />
    </div>
  );
};

export default Cash;
