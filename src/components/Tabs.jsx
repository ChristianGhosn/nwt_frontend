import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { CirclePlus, X } from "lucide-react";

import {
  createBudgetTab,
  deleteBudgetTab,
  renameBudgetTab,
} from "../store/slices/budgetSlice";
import ConfirmDelete from "./ConfirmDelete";

const Tabs = ({ tabs = [], activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const { getAccessTokenSilently } = useAuth0();

  const [adding, setAdding] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [editingTab, setEditingTab] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [tabToDelete, setTabToDelete] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const inputRef = useRef(null);

  const handleAddClick = () => {
    setAdding(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAddConfirm = async () => {
    const trimmed = newTabName.trim();
    const nameExists = tabs.some((tab) => tab.name === trimmed);

    if (trimmed && !nameExists) {
      try {
        const { newTab } = await dispatch(
          createBudgetTab({ tabName: trimmed, getAccessTokenSilently })
        ).unwrap();

        if (newTab) {
          setActiveTab(newTab.name);
        }
      } catch (err) {
        console.log("Failed to add tab", err);
      }
    }
    setNewTabName("");
    setAdding(false);
  };

  const handleKeyDownAdd = (e) => {
    if (e.key === "Enter") handleAddConfirm();
    else if (e.key === "Escape") {
      setNewTabName("");
      setAdding(false);
    }
  };

  const requestDeleteTab = (tabId) => {
    setTabToDelete(tabId);
    setIsDialogOpen(true);
  };

  const confirmDeleteTab = async () => {
    const toDelete = tabs.find((tab) => tab._id === tabToDelete);
    if (!toDelete) return;

    if (toDelete.name === "Main") {
      // Optionally prevent deleting Main tab or show an error
      setTabToDelete(null);
      setIsDialogOpen(false);
      return;
    }

    try {
      const res = await dispatch(
        deleteBudgetTab({ id: tabToDelete, getAccessTokenSilently })
      ).unwrap();

      setActiveTab("Main");
    } catch (err) {
      console.log("Failed to delete tab");
    }
  };

  const handleCancelDelete = () => {
    setTabToDelete(null);
    setIsDialogOpen(false);
  };

  const handleDoubleClick = (tab) => {
    if (tab === "Main") return;
    setEditingTab(tab._id);
    setEditingName(tab.name);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleRenameConfirm = async () => {
    const trimmed = editingName.trim();
    const nameExists = tabs.some((tab) => tab.name === trimmed);
    const tabToRename = tabs.find((tab) => tab._id === editingTab);

    if (trimmed && tabToRename && !nameExists && tabToRename.name !== "Main") {
      try {
        const { renamedTab } = await dispatch(
          renameBudgetTab({
            getAccessTokenSilently,
            id: editingTab,
            data: { name: trimmed },
          })
        ).unwrap();
        if (renamedTab) {
          setActiveTab(renamedTab.name);
        }
      } catch (err) {
        console.error("Failed to rename tab");
      }
    }
    setEditingTab(null);
    setEditingName("");
  };

  const handleKeyDownEdit = (e) => {
    if (e.key === "Enter") handleRenameConfirm();
    if (e.key === "Escape") {
      setEditingTab(null);
      setEditingName("");
    }
  };

  return (
    <>
      <div className="mt-4 inline-flex rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab?.name;
          const isEditing = editingTab === tab?._id;
          const isFirst = index === 0;
          const isLast = index === tabs?.length - 1;

          return (
            <div
              key={tab?._id}
              onClick={() => setActiveTab(tab?.name)}
              className={`cursor-pointer relative flex items-center px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-gray-900 dark:text-white font-semibold"
                  : "text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              } ${index > 0 ? "border-l border-gray-200" : ""} ${
                isFirst ? "rounded-l-lg" : ""
              } ${isLast && !adding ? "rounded-r-none" : ""}`}
            >
              {isEditing ? (
                <input
                  ref={inputRef}
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={handleRenameConfirm}
                  onKeyDown={handleKeyDownEdit}
                  className="text-sm px-2 py-1 border rounded focus:outline-none focus:ring"
                />
              ) : (
                <button
                  onDoubleClick={() => handleDoubleClick(tab)}
                  className="cursor-pointer focus:outline-none"
                >
                  {tab?.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 h-0.5 w-full bg-gray-600 dark:bg-gray-200"></span>
                  )}
                </button>
              )}

              {tab?.name !== "Main" && !isEditing && isActive && (
                <button
                  onClick={() => requestDeleteTab(tab?._id)}
                  className="cursor-pointer ml-2 text-gray-400 hover:text-red-500"
                  aria-label={`Delete ${tab?.name}`}
                >
                  <X size={12} strokeWidth={3} />
                </button>
              )}
            </div>
          );
        })}

        {adding ? (
          <input
            ref={inputRef}
            type="text"
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            onBlur={handleAddConfirm}
            onKeyDown={handleKeyDownAdd}
            className="px-3 py-2 text-sm border-l border-gray-200 focus:outline-none rounded-r-lg"
            placeholder="New tab name"
          />
        ) : (
          <button
            onClick={handleAddClick}
            className="cursor-pointer px-4 py-2 border-l border-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-r-lg transition"
            aria-label="Add new tab"
          >
            <CirclePlus size={18} strokeWidth={2} />
          </button>
        )}
      </div>

      <ConfirmDelete
        isOpen={isDialogOpen}
        onClose={handleCancelDelete}
        handleDelete={confirmDeleteTab}
        handleCancel={handleCancelDelete}
        label={tabs.find((tab) => tab?._id === tabToDelete)?.name}
      />
    </>
  );
};

export default Tabs;
