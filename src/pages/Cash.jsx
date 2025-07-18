import { useEffect, useState } from "react";
import Table from "../components/Table";
import { useAuth0 } from "@auth0/auth0-react";
import { getCash, updateCash } from "../lib/appwrite";

const Cash = () => {
  const { isAuthenticated, user } = useAuth0();
  const [data, setData] = useState({
    Cash: {
      tableHeading: "Cash Overview",
      headings: ["Bank", "Currency", "Balance"],
      keys: ["bank", "currency", "balance"],
      data: [{ $id: 0, bank: "Total Balance", currency: "USD", balance: 0.0 }],
    },
  });

  useEffect(() => {
    const fetchCash = async () => {
      if (isAuthenticated && user?.sub) {
        const res = await getCash(user.sub);
        if (res)
          setData((prevState) => ({
            ...prevState,
            Cash: {
              ...prevState.Cash,
              data: res,
            },
          }));
      }
    };
    fetchCash();
  }, [isAuthenticated, user]);

  // Update balance function
  const onUpdate = async ($id, key, value) => {
    // 1. Get the current object that needs updating
    const currentItem = data.Cash.data.find((item) => item.$id === $id);
    if (!currentItem) return;

    // 2. Create updated object (only the changed field)
    const updatedFields = { [key]: value };

    // 3. Call Appwrite to update the backend
    const updatedCash = await updateCash(updatedFields, $id, user.sub);

    setData((prev) => {
      return {
        ...prev,
        Cash: {
          ...prev.Cash,
          data: updatedCash,
        },
      };
    });
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Cash</h1>
      <Table
        tableHeading={data.Cash.tableHeading}
        headings={data.Cash.headings}
        keys={data.Cash.keys}
        data={data.Cash.data}
        editableColumnKey={"balance"}
        onUpdate={onUpdate}
      />
    </div>
  );
};

export default Cash;
