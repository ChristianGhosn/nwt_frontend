import React from "react";
import PopupDialog from "./PopupDialog";
import Button from "./Button";

const ConfirmDelete = ({
  isOpen,
  onClose,
  handleDelete,
  handleCancel,
  label,
}) => {
  return (
    <PopupDialog title="Confirm Delete" isOpen={isOpen} onClose={onClose}>
      <div className="mt-2 text-gray-700">
        <p>Are you sure you want to delete?</p>
        <span className="font-semibold">{label}</span>
      </div>

      <div className="mt-4 flex justify-end space-x-2">
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleDelete}>Delete</Button>
      </div>
    </PopupDialog>
  );
};

export default ConfirmDelete;
