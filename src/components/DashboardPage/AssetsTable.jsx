import { useCashData } from "../../hooks/useCashData";
import Table from "../Table";

const AssetsTable = () => {
  const config = {
    tableHeading: "Assets Overview",
    headings: ["", "Total ($)", "Gains ($)", "Gains (%)"],
    keys: ["category", "total", "gains", "gainsPercentage"],
  };

  const { total: totalCash, loading, error } = useCashData();

  const data = [
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
      total: totalCash?.balance || 0.0,
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
  ];

  return <Table {...config} data={data} />;
};

export default AssetsTable;
