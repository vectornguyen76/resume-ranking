import React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  PaginationState,
  getPaginationRowModel,
  OnChangeFn,
} from "@tanstack/react-table";
import { Pagination, TablePagination, Stack } from "@mui/material";

type Props = {
  data: any[];
  columns: any[];
};

const listPageSize = [10, 20, 30, 40];

const UseTableTanstack = (props: Props) => {
  const [pageSize, setPageSize] = React.useState<number>(listPageSize[0]);

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-2 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="hidden md:grid md:grid-cols-3 gap-2 mt-12 p-4">
        <div></div>
        <div className="md:flex md:justify-center text-center">
          <Stack spacing={2} mt={2}>
            <Pagination
              color="primary"
              showFirstButton
              showLastButton
              count={table.getPageCount()}
              page={table.getState().pagination.pageIndex + 1}
              onChange={(event, newPage) => {
                table.setPageIndex((newPage as number) - 1);
              }}
            />
          </Stack>
        </div>
        <div className="md:flex md:justify-end text-center">
          <TablePagination
            component="div"
            count={table.getPreFilteredRowModel().rows.length}
            page={table.getState().pagination.pageIndex}
            onPageChange={(event, newPage) => {
              table.setPageIndex((newPage as number) - 1);
            }}
            nextIconButtonProps={{ style: { display: "none" } }}
            backIconButtonProps={{ style: { display: "none" } }}
            rowsPerPageOptions={listPageSize}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(event) => {
              const pageSize = Number(event.target.value);
              setPageSize(pageSize);
              table.setPageSize(pageSize);
            }}
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </>
  );
};

export default UseTableTanstack;
