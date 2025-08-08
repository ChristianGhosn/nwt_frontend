import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";

import {
  deleteBudgetItem,
  updateBudgetItem,
} from "../../store/slices/budgetSlice";
import Tabs from "../Tabs";
import { useEffect } from "react";
import RegularTable from "../table/RegularTable";
import EditableCell from "../table/cells/EditableCell";
import MenuCell from "../table/cells/MenuCell";
import { budgetCategories } from "../../constants/budgetCategories";
import FixedCell from "../table/cells/FixedCell";

const columnHelper = createColumnHelper();

const BudgetTable = ({ budget, cashAccounts, loading }) => {
  const { getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState("Main");

  const activeTabObj = budget?.tabs?.find((tab) => tab?.name === activeTab);
  const activeItems = activeTabObj?.items || [];

  const accounts =
    cashAccounts.map((acc) => ({ _id: acc._id, name: acc.bank })) || [];

  const columns = [
    columnHelper.accessor("item", {
      header: "Item",
      enableSorting: true,
      cell: (info) => (
        <EditableCell
          value={info.getValue()}
          row={info.row}
          columnId="item"
          onUpdate={handleUpdate}
          type="text"
        />
      ),
    }),
    columnHelper.accessor("allocation", {
      header: "Allocation",
      size: 70,
      enableSorting: true,
      cell: (info) => (
        <FixedCell value={info.getValue()} row={info.row} format="percentage" />
      ),
    }),
    columnHelper.accessor("monthly", {
      header: "Monthly",
      size: 80,
      enableSorting: true,
      cell: (info) => (
        <EditableCell
          value={info.getValue()}
          row={info.row}
          columnId="monthly"
          onUpdate={handleUpdate}
          type="number"
          format="currency"
        />
      ),
    }),
    columnHelper.accessor("weekly", {
      header: "Weekly",
      size: 80,
      enableSorting: true,
      cell: (info) => (
        <FixedCell value={info.getValue()} row={info.row} format="currency" />
      ),
    }),
    columnHelper.accessor("yearly", {
      header: "Yearly",
      size: 80,
      enableSorting: true,
      cell: (info) => (
        <FixedCell value={info.getValue()} row={info.row} format="currency" />
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      enableSorting: true,
      cell: (info) => (
        <MenuCell
          value={info.getValue()}
          row={info.row}
          columnId="category"
          options={budgetCategories}
          onUpdate={handleUpdate}
        />
      ),
    }),
    columnHelper.accessor("bankAccount", {
      header: "Bank Account",
      enableSorting: true,
      cell: (info) => (
        <MenuCell
          value={info.getValue()}
          row={info.row}
          columnId="bankAccount"
          options={accounts}
          onUpdate={handleUpdate}
        />
      ),
    }),
  ];

  // If tab is deleted and it was active, fallback to "Main" tab
  useEffect(() => {
    const matchedTab = budget?.tabs?.find((tab) => tab?.name === activeTab);

    if (!matchedTab) {
      // Fall back to Main or first tab
      const mainTab = budget?.tabs?.find((t) => t?.name === "Main");
      if (mainTab) {
        setActiveTab("Main");
      } else if (budget?.tabs?.length > 0) {
        setActiveTab(budget.tabs[0].name);
      }
    }
  }, [budget?.tabs, activeTab]);

  const handleUpdate = async (id, key, value) => {
    // 1. Get the current object that needs updating
    const currentItem = activeItems.find((item) => item._id === id);
    if (!currentItem) return;

    // 2. Create updated object (only the changed field)
    const updatedField = { [key]: value };

    // 3. Call endpoint
    if (updatedField) {
      await dispatch(
        updateBudgetItem({
          data: updatedField,
          id: id,
          getAccessTokenSilently,
        })
      ).unwrap();
    }
  };

  return (
    <div>
      {!loading && (
        <Tabs
          tabs={budget?.tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTabObj && (
        <RegularTable
          columns={columns}
          data={activeItems}
          deletable={(row) => !row.isSummary}
          onDelete={(row) =>
            dispatch(
              deleteBudgetItem({ documentId: row._id, getAccessTokenSilently })
            )
          }
        />
      )}
    </div>
  );
};

export default BudgetTable;
