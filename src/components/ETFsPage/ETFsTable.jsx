import axios from "axios";

import Table from "../Table";
import { currencies } from "../../constants/currencies";

const ETFsTable = () => {
  const config = {
    tableHeading: "ETFs Overview",
    headings: ["Ticker", "Fund Name", "Currency", "Live Price", "Held Units"],
    keys: ["ticker", "fund_name", "currency", "live_price", "held_units"],
    editableColumns: {
      ticker: { type: "text" },
      currency: { type: "select", options: currencies },
    },
    deletableRows: true,
  };

  const searchSymbol = async (query) => {
    const res = await axios.get(`https://finnhub.io/api/v1/search`, {
      params: {
        q: query,
        token: import.meta.env.VITE_FINNHUB_API_KEY,
      },
    });
    return res.data;
  };

  searchSymbol("VGS")
    .then((data) => console.log(data))
    .catch((err) => console.error(err));

  const data = [
    {
      ticker: "ASX:VGS",
      fund_name: "Vanguard Msci Index Instrument",
      currency: "AUD",
      live_price: 143.91,
      held_units: 4,
    },
    {
      ticker: "ASX:VAS",
      fund_name: "Vanguard Australian Shares Index",
      currency: "AUD",
      live_price: 107.28,
      held_units: 2,
    },
  ];

  const handleUpdate = () => {
    console.log("Updating Table");
  };

  const handleDelete = () => {
    console.log("Deleting Table Row");
  };

  return (
    <Table
      {...config}
      data={data}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
};

export default ETFsTable;
