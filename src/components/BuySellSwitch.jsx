import { Switch } from "@headlessui/react";
import { useState } from "react";

const BuySellSwitch = ({ action = true, setAction }) => {
  return (
    <Switch
      checked={action}
      onChange={setAction}
      className="group relative inline-flex h-12 w-42 items-center rounded-full bg-gray-200 transition"
    >
      <span className="absolute top-1 left-1 z-10 block h-10 w-[calc(50%-4px)] rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out group-data-checked:translate-x-[calc(100%)]" />
      <span className="relative z-0 flex h-full w-full items-center justify-around text-lg font-semibold">
        <span
          className={`px-2 transition-colors duration-200 ease-in-out ${
            action ? "text-gray-900" : "text-transparent"
          }`}
        >
          Buy
        </span>
        <span
          className={`px-2 transition-colors duration-200 ease-in-out ${
            !action ? "text-gray-900" : "text-transparent"
          }`}
        >
          Sell
        </span>
      </span>
    </Switch>
  );
};

export default BuySellSwitch;
