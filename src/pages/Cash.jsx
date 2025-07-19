import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";

import CashTable from "../components/CashPage/CashTable";
import Button from "../components/Button";
import NewBankModal from "../components/CashPage/NewBankModal";

import { createCashData } from "../store/slices/cashSlice";

const Cash = () => {
  const dispatch = useDispatch();
  const { user } = useAuth0();

  const [isOpen, setIsOpen] = useState(false);

  const handleAddBank = (data) => {
    // Logic for creating a new bank can be added here
    console.log("New Bank saved", data);
    dispatch(
      createCashData({
        data,
        ownerId: user.sub,
      })
    );
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Cash</h1>
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}>
          <CirclePlus size={24} strokeWidth={1.75} />
          Add Bank
        </Button>
      </div>
      <CashTable />
      <NewBankModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleAddBank}
      />
    </div>
  );
};

export default Cash;
