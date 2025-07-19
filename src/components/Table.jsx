import { useEffect, useState } from "react";

import TableHeadings from "./table/TableHeadings";
import TableBody from "./table/TableBody";

const Table = ({
  tableHeading,
  headings,
  keys,
  data: initialData,
  editableColumnKey,
  onUpdate,
}) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  return (
    <div className="mt-4 overflow-x-auto w-full">
      <h2 className="text-lg font-semibold mb-2">{tableHeading}</h2>

      <table className="w-full text-left text-sm rounded-md shadow-sm">
        <TableHeadings headings={headings} />
        <TableBody
          data={data}
          keys={keys}
          onUpdate={onUpdate}
          editableColumnKey={editableColumnKey}
        />
      </table>
    </div>
  );
};

export default Table;
