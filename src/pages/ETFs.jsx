import { useState } from "react";
import { CirclePlus } from "lucide-react";

import ETFsTable from "../components/ETFsPage/ETFsTable";
import Button from "../components/Button";
import NewTickerModal from "../components/ETFsPage/NewTickerModal";

const ETFs = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Exchange Traded Funds</h1>
      <div className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}>
          <CirclePlus size={24} strokeWidth={1.75} />
          Track ETF
        </Button>
      </div>
      <ETFsTable />
      <NewTickerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default ETFs;
