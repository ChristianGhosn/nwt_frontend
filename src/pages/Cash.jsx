import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from "react-redux";

import Table from "../components/Table";
import { fetchCashData, updateCashData } from "../store/slices/cashSlice";

const Cash = () => {
  const { isAuthenticated, user } = useAuth0();

  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.cash);

  const config = {
    tableHeading: "Cash Overview",
    headings: ["Bank", "Currency", "Balance"],
    keys: ["bank", "currency", "balance"],
  };

  useEffect(() => {
    if (user?.sub) dispatch(fetchCashData(user.sub));
  }, [isAuthenticated, user]);

  // Update balance function
  const handleUpdate = async ($id, key, value) => {
    // 1. Get the current object that needs updating
    const currentItem = data.find((item) => item.$id === $id);
    if (!currentItem) return;

    // 2. Create updated object (only the changed field)
    const updatedFields = { [key]: value };

    // 3. Call Appwrite to update the backend
    if (updatedFields) {
      dispatch(
        updateCashData({
          data: updatedFields,
          documentId: $id,
          ownerId: user.sub,
        })
      );
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Cash</h1>
      <Table
        tableHeading={config.tableHeading}
        headings={config.headings}
        keys={config.keys}
        data={data}
        editableColumnKey={"balance"}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default Cash;
