import { useEffect, useState } from "react";

import TableHeadings from "./table/TableHeadings";
import TableBody from "./table/TableBody";
import Loader from "./Loader";

const Table = ({
  tableHeading,
  headings,
  keys,
  columnFormats,
  data: initialData,
  editableColumns,
  deletableRows = false,
  onUpdate,
  onDelete,
  isLoading = false,
}) => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="mt-4 overflow-x-auto w-full">
      <h2 className="text-lg font-semibold mb-2">{tableHeading}</h2>

      <table className="w-full text-left text-sm rounded-md shadow-sm">
        <TableHeadings headings={headings} />
        <TableBody
          data={data}
          keys={keys}
          columnFormats={columnFormats}
          onUpdate={onUpdate}
          onDelete={onDelete}
          editableColumns={editableColumns}
          deletableRows={deletableRows}
        />
      </table>
    </div>
  );
};

export default Table;
