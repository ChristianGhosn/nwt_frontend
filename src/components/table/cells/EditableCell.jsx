// components/EditableCell.js
import React, { useState, useEffect } from "react";

export default function EditableCell({
  value: initialValue,
  row,
  columnId,
  onUpdate,
  type,
  format = "",
}) {
  const isSummary = row.original.isSummary;
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setValue(initialValue); // Reset when row data changes
  }, [initialValue]);

  const handleSubmit = () => {
    setEditing(false);
    if (value !== initialValue) {
      onUpdate(row.original._id, columnId, value);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setValue(initialValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isSummary) {
    return (
      <div className="px-4 py-3 text-gray-400 italic">
        {format === "currency" ? `$${initialValue}` : initialValue}
      </div>
    );
  }

  return editing ? (
    <input
      className="border p-2 rounded w-full outline-none"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={handleSubmit}
      onKeyDown={handleKeyDown}
      autoFocus
      type={type}
    />
  ) : (
    <div
      onClick={() => setEditing(true)}
      className="px-4 py-3 cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200 transition-colors w-full"
    >
      {format === "currency" ? `$${value}` : value}
    </div>
  );
}
