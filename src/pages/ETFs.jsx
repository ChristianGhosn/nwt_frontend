import React from "react";
import ETFsTable from "../components/ETFsPage/ETFsTable";

const ETFs = () => {
  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Exchange Traded Funds</h1>
      <ETFsTable />
    </div>
  );
};

export default ETFs;
