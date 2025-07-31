import { useState } from "react";
import { CirclePlus } from "lucide-react";

import TrackedETFsTable from "../components/ETFsPage/TrackedETFsTable";
import ETFTransactionsTable from "../components/ETFsPage/ETFTransactionsTable";
import Button from "../components/Button";
import NewTickerModal from "../components/ETFsPage/NewTickerModal";
import NewETFTransactionModal from "../components/ETFsPage/NewETFTransactionModal";

const ETFs = () => {
  const [openModal, setOpenModal] = useState(null);

  const openTickerModal = () => setOpenModal("ticker");
  const openTransactionModal = () => setOpenModal("transaction");
  const closeModal = () => setOpenModal(null);

  return (
    <div className="w-full">
      <h1 className="text-3xl font-semibold">Exchange Traded Funds</h1>
      <div className="flex justify-end mt-4">
        <Button onClick={openTickerModal}>
          <CirclePlus size={24} strokeWidth={1.75} />
          Track ETF
        </Button>
      </div>
      <TrackedETFsTable />
      <div className="flex justify-end mt-8">
        <Button onClick={openTransactionModal}>
          <CirclePlus size={24} strokeWidth={1.75} />
          Add ETF Transaction
        </Button>
      </div>
      <ETFTransactionsTable />

      <NewTickerModal isOpen={openModal === "ticker"} onClose={closeModal} />
      <NewETFTransactionModal
        isOpen={openModal === "transaction"}
        onClose={closeModal}
      />
    </div>
  );
};

export default ETFs;
