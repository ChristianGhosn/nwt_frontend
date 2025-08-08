import { useState } from "react";

import BudgetTable from "../components/BudgetPage/BudgetTable";
import Button from "../components/Button";
import NewBudgetItemForm from "../components/BudgetPage/NewBudgetItemForm";
import { useBudgetData } from "../hooks/useBudgetData";
import { useCashData } from "../hooks/useCashData";

const Budget = () => {
  const { data: budget, loading } = useBudgetData();
  const { data: cashAccounts } = useCashData();

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Budget</h1>
        {!loading && (
          <Button onClick={() => setIsOpen(true)}>New Budget Item</Button>
        )}
      </div>
      <BudgetTable
        budget={budget}
        cashAccounts={cashAccounts}
        loading={loading}
      />
      <NewBudgetItemForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        budget={budget}
        cashAccounts={cashAccounts}
      />
    </div>
  );
};

export default Budget;
