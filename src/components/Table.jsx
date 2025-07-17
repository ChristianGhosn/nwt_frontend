import { useState } from "react";

import TableHeadings from "./table/TableHeadings";
import TableBody from "./table/TableBody";

const Table = ({
  tableHeading,
  headings,
  keys,
  data: initialData,
  editableColumnKey,
}) => {
  const [data, setData] = useState(initialData);

  const handleUpdate = (id, key, value) => {
    const updated = data.map((item) =>
      item.id === id ? { ...item, [key]: value } : item
    );
    setData(updated);
  };

  return (
    <div className="mt-4 overflow-x-auto w-full">
      <h2 className="text-lg font-semibold mb-2">{tableHeading}</h2>

      <table className="w-full text-left text-sm rounded-md shadow-sm">
        <TableHeadings headings={headings} />
        <TableBody
          data={data}
          keys={keys}
          onUpdate={handleUpdate}
          editableColumnKey={editableColumnKey}
        />
      </table>
    </div>
  );
};

export default Table;
