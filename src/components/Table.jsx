const Table = ({ tableHeading, headings, keys, data }) => {
  return (
    <div className="mt-4 overflow-x-auto w-full">
      <h2 className="text-lg font-semibold mb-2">{tableHeading}</h2>

      <table className="w-full text-left text-sm rounded-md shadow-sm">
        <thead className="border-b border-gray-300 text-xs font-semibold uppercase ">
          <tr>
            {headings.map((heading, index) => (
              <th key={index} className="px-4 py-2">
                {heading}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-300">
          {data.map((item, rowIndex) => {
            const isTotalRow =
              typeof item.category === "string" &&
              item.category.toLowerCase().includes("total");

            return (
              <tr
                key={rowIndex}
                className={`${
                  isTotalRow ? "font-bold dark:bg-gray-600 bg-gray-100" : ""
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
                        cellIndex === 0 ? "font-medium" : ""
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
