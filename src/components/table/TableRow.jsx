import { useState, useEffect, useRef } from "react";

import TableCell from "./TableCell";
import { X } from "lucide-react";

const TableRow = ({
  item,
  keys,
  onUpdate,
  onDelete,
  editableColumns = {},
  deletableRows,
}) => {
  const [editingCell, setEditingCell] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  const handleDelete = () => {
    if (onDelete && typeof onDelete === "function") {
      onDelete(item._id);
    }
  };

  const handleSave = () => {
    const { key, value } = editingCell || {};
    if (!key) return;

    const columnType = editableColumns[key]?.type;
    if (columnType === "number" && (value === "" || isNaN(value))) return;

    if (value !== item[key]) {
      onUpdate(item._id, key, value);
    }

    setEditingCell(null);
  };

  const handleCancel = () => {
    setEditingCell(null);
  };

  const isTotalRow =
    item._id === 0 &&
    Object.values(item).some(
      (value) =>
        typeof value === "string" && value.toLowerCase().includes("total")
    );

  return (
    <tr
      className={`${
        isTotalRow ? "font-bold dark:bg-gray-600 bg-gray-100" : ""
      }`}
    >
      {keys.map((key, index) => {
        const value = item[key];
        const isEditable = !!editableColumns[key];
        const isCellEditing = editingCell?.key === key;

        return (
          <TableCell
            key={index}
            value={editingCell?.key === key ? editingCell.value : value}
            columnKey={key}
            itemId={item._id}
            isEditing={isCellEditing}
            editable={isEditable}
            inputType={editableColumns[key]?.type}
            options={editableColumns[key]?.options || []}
            onStartEdit={() => setEditingCell({ key, value })}
            onChange={(newValue) =>
              setEditingCell((prev) => ({ ...prev, value: newValue }))
            }
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );
      })}

      {deletableRows && (
        <td className="px-4 py-3 flex items-center justify-end">
          {item._id !== 0 && (
            <button
              onClick={() => handleDelete(item._id)}
              className="text-red-500 hover:text-red-700 transition-colors duration-200 cursor-pointer"
            >
              <X size={16} />
            </button>
          )}
        </td>
      )}
    </tr>
  );
};

export default TableRow;
