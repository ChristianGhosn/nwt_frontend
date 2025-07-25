import { useEffect, useState, useRef } from "react";
import { Save, X, SquarePen } from "lucide-react";

const TableCell = ({
  value,
  columnKey,
  itemId,
  format,
  isEditing,
  editable,
  inputType,
  options = [],
  onStartEdit,
  onChange,
  onSave,
  onCancel,
}) => {
  const inputRef = useRef(null);
  const displayRef = useRef(null);
  const [cellWidth, setCellWidth] = useState(null);

  useEffect(() => {
    if (!isEditing && displayRef.current) {
      // Measure width of displayed content when NOT editing
      setCellWidth(displayRef.current.offsetWidth);
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const renderInput = () => {
    if (inputType === "select") {
      return (
        <select
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
          onBlur={onSave}
        >
          <option value="" disabled>
            Select...
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        ref={inputRef}
        type={inputType || "text"}
        value={value}
        onChange={(e) =>
          onChange(
            inputType === "number" ? parseFloat(e.target.value) : e.target.value
          )
        }
        onBlur={onSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onSave();
          } else if (e.key === "Escape") {
            e.preventDefault();
            onCancel();
          }
        }}
        autoFocus
        className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
      />
    );
  };

  const formatDisplayValue = (val) => {
    if (format === "currency" && typeof val === "number") {
      return `$${val.toFixed(2)}`;
    }

    if (format === "number" && typeof val === "number") {
      return val.toFixed(2);
    }

    if (format === "percentage" && typeof val === "number") {
      return `${val.toFixed(2)}%`;
    }

    return val ?? "";
  };

  const displayValue = formatDisplayValue(value);

  return (
    <td
      ref={displayRef}
      className="px-4 py-3 relative group"
      style={
        isEditing && cellWidth
          ? { minWidth: cellWidth + "px", width: cellWidth + "px" }
          : undefined
      }
    >
      {isEditing && itemId !== 0 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
          className="flex items-center justify-between gap-1 w-full"
        >
          {renderInput()}
          <div className="flex items-center gap-1">
            <button type="submit">
              <Save
                size={16}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 transition-colors duration-300 cursor-pointer"
              />
            </button>
            <button type="button" onClick={onCancel}>
              <X
                size={16}
                className="text-gray-400 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400 transition-colors duration-300 cursor-pointer"
              />
            </button>
          </div>
        </form>
      ) : (
        <div
          className={`flex items-center justify-between gap-1 w-full ${
            itemId !== 0 && editable ? "cursor-pointer" : ""
          }`}
          onClick={() => {
            if (editable && itemId !== 0) {
              onStartEdit(columnKey);
            }
          }}
        >
          <span ref={displayRef} className="font-medium truncate">
            {displayValue}
          </span>
          {editable && itemId !== 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStartEdit(columnKey);
              }}
            >
              <SquarePen
                size={16}
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 dark:text-gray-200 group-hover:opacity-100 transition cursor-pointer"
              />
            </button>
          )}
        </div>
      )}
    </td>
  );
};

export default TableCell;
