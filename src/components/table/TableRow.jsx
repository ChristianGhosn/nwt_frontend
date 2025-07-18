import { useState } from "react";
import { SquarePen, Save, X } from "lucide-react";

const TableRow = ({ item, keys, onUpdate, editableColumnKey }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(item[editableColumnKey]);

  const handleEditClick = () => {
    if (!isTotalRow) {
      setEditedValue(item[editableColumnKey]);
      setIsEditing(true);
    }
  };

  const handleSaveClick = () => {
    if (editedValue === "" || isNaN(editedValue)) return;
    setIsEditing(false);
    onUpdate(item.$id, editableColumnKey, parseFloat(editedValue));
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const isTotalRow = Object.values(item).some(
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
        const displayValue =
          key === "balance" && typeof value === "number"
            ? `$${value.toFixed(2)}`
            : value ?? "";

        return (
          <td
            key={index}
            className={`px-4 py-3 ${index === 0 ? "font-medium" : ""}`}
          >
            {isEditing && key === editableColumnKey ? (
              <input
                type="number"
                className="w-[80px] max-w-full border border-gray-400 dark:border-gray-200 rounded-lg px-2 py-1 text-sm"
                value={editedValue ?? ""}
                onChange={(e) =>
                  setEditedValue(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
              />
            ) : (
              displayValue
            )}
          </td>
        );
      })}

      {editableColumnKey && (
        <td className="px-2 py-3 text-right align-middle w-1 whitespace-nowrap">
          {isTotalRow ? null : isEditing ? (
            <div className="flex items-center gap-2">
              <button
                className="hover:text-gray-600 dark:hover:text-gray-300"
                onClick={handleSaveClick}
              >
                <Save size={18} strokeWidth={1.25} />
              </button>
              <button
                className="hover:text-gray-600 dark:hover:text-gray-300"
                onClick={handleCancelClick}
              >
                <X size={18} strokeWidth={1.25} />
              </button>
            </div>
          ) : (
            <button
              className="hover:text-gray-600 dark:hover:text-gray-300"
              onClick={handleEditClick}
            >
              <SquarePen size={18} strokeWidth={1.25} />
            </button>
          )}
        </td>
      )}
    </tr>
  );
};

export default TableRow;
