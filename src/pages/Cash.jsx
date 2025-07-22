import { useState } from "react";
import { CirclePlus } from "lucide-react";

import CashTable from "../components/CashPage/CashTable";
import Button from "../components/Button";
import NewBankModal from "../components/CashPage/NewBankModal";

const Cash = () => {
  const [isOpen, setIsOpen] = useState(false);

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
      <NewBankModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Cash;
