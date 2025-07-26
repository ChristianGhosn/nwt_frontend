import TableRow from "./TableRow";

const TableBody = ({
  data,
  keys,
  columnFormats,
  onUpdate,
  onDelete,
  editableColumns,
  deletableRows,
}) => {
  return (
    <tbody className="divide-y divide-gray-300">
      {data.map((item, rowIndex) => (
        <TableRow
          key={rowIndex}
          item={item}
          keys={keys}
          columnFormats={columnFormats}
          onUpdate={onUpdate}
          onDelete={onDelete}
          editableColumns={editableColumns}
          deletableRows={deletableRows}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
