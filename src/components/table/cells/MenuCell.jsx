import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

const MenuCell = ({ value, options, row, columnId, onUpdate }) => {
  const isSummary = row.original.isSummary;

  const handleSelect = (newValue) => {
    if (newValue !== value) {
      onUpdate(row.original._id, columnId, newValue);
    }
  };

  if (isSummary) {
    const display = options.find((opt) => opt._id === value)?.name || value;
    return (
      <div className="px-4 py-3 text-gray-400 italic">
        {display || <span className="italic text-gray-400">—</span>}
      </div>
    );
  }

  return (
    <div className="w-full">
      <Menu>
        <MenuButton className="px-4 py-3 cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200 transition-colors w-full text-start outline-none">
          {value || <span className="text-gray-400 italic">Select</span>}
        </MenuButton>
        <MenuItems
          transition
          anchor="bottom end"
          className="border border-gray-200 bg-white dark:bg-gray-900 origin-top-right rounded-lg dark:text-gray-200 text-gray-800 outline-none"
        >
          {options.map((i) => (
            <MenuItem key={i._id} as="div" className="w-full">
              <button
                onClick={() => handleSelect(i._id)}
                value={i._id}
                className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition duration-100 ease-out"
              >
                {i.name}
              </button>
            </MenuItem>
          ))}
        </MenuItems>
      </Menu>
    </div>
  );
};

export default MenuCell;
