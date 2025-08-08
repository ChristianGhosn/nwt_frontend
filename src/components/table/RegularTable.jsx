import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { X, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

import InputField from "../Input";

const RegularTable = ({ columns, data, deletable = () => false, onDelete }) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="p-4 w-full">
      {/* Global Filter */}
      <InputField
        type="text"
        placeholder="Search..."
        value={globalFilter ?? ""}
        label="Filter"
        onChange={(e) => setGlobalFilter(e.target.value)}
      />
      <div className="mt-4 overflow-x-scroll">
        <table className="w-full text-left text-sm rounded-md shadow-sm">
          <thead className="border-b border-gray-300 text-xs font-semibold uppercase ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-4 py-2 text-start ${
                      header.column.getCanSort()
                        ? "cursor-pointer hover:bg-gray-100"
                        : ""
                    }`}
                    style={{ width: header.column.columnDef.size }}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc" && (
                        <ChevronUp className="w-3 h-3" />
                      )}
                      {header.column.getIsSorted() === "desc" && (
                        <ChevronDown className="w-3 h-3" />
                      )}
                      {header.column.getIsSorted() === false && (
                        <ChevronsUpDown className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-300">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="relative group"
                    style={{ width: cell.column.columnDef.size }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="w-0 text-center align-middle">
                  {deletable(row.original) && (
                    <button
                      onClick={() => onDelete(row.original)}
                      className="text-red-500 hover:text-red-700 cursor-pointer p-1"
                      aria-label="Delete row"
                    >
                      <X size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegularTable;
