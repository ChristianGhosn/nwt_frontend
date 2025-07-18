import { useState, useEffect } from "react";

import Table from "../components/Table";

const Dashboard = () => {
  const [data, setData] = useState({
    Assets: {
      tableHeading: "Assets Overview",
      headings: ["", "Total ($)", "Gains ($)", "Gains (%)"],
      keys: ["category", "total", "gains", "gainsPercentage"],
      data: [
        {
          category: "ETFs",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
        {
          category: "Stocks",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
        {
          category: "Managed Funds",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
        {
          category: "Crypto",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
        {
          category: "Cash Savings",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
        {
          category: "Other Assets",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
        {
          category: "Superannuation",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
        {
          category: "Property",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
        {
          category: "Total Assets",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
        {
          category: "Total Assets (w/o Super)",
          total: 0.0,
          gains: 0.0,
          gainsPercentage: "0.00%",
        },
      ],
    },
    Liabilities: {
      tableHeading: "Liabilities Overview",
      headings: ["Name", "Initial Debt", "Paid", "Current Debt"],
      keys: ["category", "initialDebt", "paid", "currentDebt"],
      data: [
        { category: "Loans", initialDebt: 0.0, paid: 0.0, currentDebt: 0.0 },
        {
          category: "Property Loans",
          initialDebt: 0.0,
          paid: 0.0,
          currentDebt: 0.0,
        },
        {
          category: "Total Liabilities",
          initialDebt: 0.0,
          paid: 0.0,
          currentDebt: 0.0,
        },
      ],
    },
  });

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Table
          tableHeading={data.Assets.tableHeading}
          data={data.Assets.data}
          keys={data.Assets.keys}
          headings={data.Assets.headings}
        />
        <Table
          tableHeading={data.Liabilities.tableHeading}
          data={data.Liabilities.data}
          keys={data.Liabilities.keys}
          headings={data.Liabilities.headings}
        />
      </div>
    </div>
  );
};

export default Dashboard;
