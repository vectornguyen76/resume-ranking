import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type Props = {
  data: any[];
  columns: any[];
};

const UseTableTanStackSSR = (props: Props) => {
  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 table-auto">
        <thead className="bg-gray-100 dark:bg-gray-700">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="p-4 text-xs text-center font-medium text-gray-500 uppercase dark:text-gray-400"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-2 py-2 text-center text-sm max-w-xs break-words"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
    </>
  );
};

export default UseTableTanStackSSR;
