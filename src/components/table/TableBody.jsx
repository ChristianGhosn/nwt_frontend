import TableRow from "./TableRow";

const TableBody = ({ data, keys, onUpdate, onDelete, editableColumnKey }) => {
  return (
    <tbody className="divide-y divide-gray-300">
      {data.map((item, rowIndex) => (
        <TableRow
          key={rowIndex}
          item={item}
          keys={keys}
          onUpdate={onUpdate}
          onDelete={onDelete}
          editableColumnKey={editableColumnKey}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
