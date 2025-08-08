import React from "react";

const FixedCell = ({ value, row, format = "" }) => {
  const isSummary = row.original.isSummary;

  return (
    <div className={`${isSummary ? "italic text-gray-400" : ""} px-4 py-3`}>
      {format === "currency"
        ? `$${value.toFixed(2)}`
        : format === "percentage"
        ? `${value.toFixed(2)}%`
        : value}
    </div>
  );
};

export default FixedCell;
