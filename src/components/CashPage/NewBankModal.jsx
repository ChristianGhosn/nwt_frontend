import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { currencies } from "../../constants/currencies";
import Button from "../Button";

const NewBankModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    bank: "",
    balance: 0,
    currency: "AUD",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ bank: "", balance: 0, currency: "AUD" });
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 md:left-[256px] overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Add New Bank
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium">Bank</label>
                  <input
                    type="text"
                    name="bank"
                    value={formData.bank}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Balance</label>
                  <input
                    type="number"
                    name="balance"
                    value={formData.balance}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Currency</label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  >
                    {currencies.map((cur) => (
                      <option key={cur} value={cur}>
                        {cur}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button onClick={onClose}>Cancel</Button>
                  <Button type="submit">Add Bank</Button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default NewBankModal;
