import TableRow from "./TableRow";

const TableBody = ({ data, keys, onUpdate, editableColumnKey }) => {
  return (
    <tbody className="divide-y divide-gray-300">
      {data.map((item, rowIndex) => (
        <TableRow
          key={rowIndex}
          item={item}
          keys={keys}
          onUpdate={onUpdate}
          editableColumnKey={editableColumnKey}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
