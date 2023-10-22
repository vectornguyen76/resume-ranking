import React from "react";
import { useTable, usePagination } from "react-table";

type Props = {
  columns: any[];
  data: any[];
};

const Table = ({ columns, data }: Props) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <>
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-600 table-auto"
      >
        <thead className="bg-gray-100 dark:bg-gray-700">
          {headerGroups.map((headerGroup, index) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={index}>
              {headerGroup.headers.map((column, index) => (
                <th
                  {...column.getHeaderProps()}
                  key={index}
                  scope="col"
                  className="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
        >
          {rows.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      key={cell.getCellProps().key}
                      className="px-4 py-2 flex justify-center text-base font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Table;
