import Table from "../Table";

const LiabilitiesTable = () => {
  const config = {
    tableHeading: "Liabilities Overview",
    headings: ["Name", "Initial Debt", "Paid", "Current Debt"],
    keys: ["category", "initialDebt", "paid", "currentDebt"],
  };
  const data = [
    {
      _id: 1,
      category: "Loans",
      initialDebt: 0.0,
      paid: 0.0,
      currentDebt: 0.0,
    },
    {
      _id: 2,
      category: "Property Loans",
      initialDebt: 0.0,
      paid: 0.0,
      currentDebt: 0.0,
    },
    {
      _id: 0,
      category: "Total Liabilities",
      initialDebt: 0.0,
      paid: 0.0,
      currentDebt: 0.0,
    },
  ];
  return <Table {...config} data={data} />;
};

export default LiabilitiesTable;
