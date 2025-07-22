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
      _id: 1,
      category: "ETFs",
      total: 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
    {
      _id: 2,
      category: "Stocks",
      total: 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
    {
      _id: 3,
      category: "Managed Funds",
      total: 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
    {
      _id: 4,
      category: "Crypto",
      total: 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
    {
      _id: 5,
      category: "Cash Savings",
      total: totalCash?.balance || 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
    {
      _id: 6,
      category: "Other Assets",
      total: 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
    {
      _id: 7,
      category: "Superannuation",
      total: 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
    {
      _id: 8,
      category: "Property",
      total: 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
    {
      _id: 0,
      category: "Total Assets",
      total: 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
    {
      _id: 0,
      category: "Total Assets (w/o Super)",
      total: 0.0,
      gains: 0.0,
      gainsPercentage: "0.00%",
    },
  ];

  return <Table {...config} data={data} isLoading={loading} />;
};

export default AssetsTable;
