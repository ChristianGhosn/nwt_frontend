import { useState } from "react";

const Table = ({ tableHeading, headings, keys, data }) => {
  return (
    <div className="mt-4 overflow-x-auto w-full">
      <h2 className="text-lg font-semibold mb-2">{tableHeading}</h2>
      <table className="w-full text-left text-sm text-gray-900">
        <thead className="border-b border-gray-200 text-xs font-semibold uppercase text-gray-500">
          <tr className="border-b border-gray-200">
            {headings.map((heading, index) => (
              <th key={index} className="px-4 py-2">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, rowIndex) => {
            const isTotalRow =
              typeof item.category === "string" &&
              item.category.toLowerCase().includes("total");

            return (
              <tr
                key={rowIndex}
                className={`${
                  isTotalRow
                    ? "bg-gray-100 font-semibold text-gray-800"
                    : "hover:bg-gray-50"
                }`}
              >
                {keys.map((key, cellIndex) => {
                  const value = item[key];
                  const displayValue =
                    typeof value === "number" ? value.toFixed(2) : value ?? "";

                  return (
                    <td
                      key={cellIndex}
                      className={`px-4 py-3 ${
                        cellIndex === 0 ? "font-medium" : "text-gray-500"
                      }`}
                    >
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
