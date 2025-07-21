import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const PopupDialog = ({ title, children, isOpen, onClose }) => {
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
                {title}
              </Dialog.Title>
              {children}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PopupDialog;
