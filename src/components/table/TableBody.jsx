import TableRow from "./TableRow";

const TableBody = ({
  data,
  keys,
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
