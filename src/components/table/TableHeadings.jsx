import React from "react";

const TableHeadings = ({ headings }) => {
  return (
    <thead className="border-b border-gray-300 text-xs font-semibold uppercase ">
      <tr>
        {headings.map((heading, index) => (
          <th key={index} className="px-4 py-2">
            {heading}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeadings;
