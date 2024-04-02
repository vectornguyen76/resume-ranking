"use client";
import React, { useEffect } from "react";
import { createColumnHelper, Row } from "@tanstack/react-table";
import UseTableTanStackSSR from "@/app/hooks/react-table/useTableTanStackSSR";
import {
  useDeleteFileData,
  useListCandidateData,
  useListFileDetailData,
} from "@/app/hooks/react-query/management/file/useFilesUploadData";
import { TablePagination, Drawer } from "@mui/material";
import { Dialog, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";

type Props = {
  data: CandidateResponseModel;
  refetch: () => void;
};

const TableCandidates = (props2: Props) => {
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [isOpenDrawer, setIsOpenDrawer] = React.useState<boolean>(false);
  const [fetching, setIsFetching] = React.useState<boolean>(false);
  const [fileId, setFileId] = React.useState<string>("id");
  const [fileName, setFileName] = React.useState<string>("");
  const [isOpenModalDelete, setIsOpenModalDelete] =
    React.useState<boolean>(false);
  const fileDetailQuery = useListFileDetailData(fileId);
  const { mutate: deleteFile } = useDeleteFileData(fileId);

  // Fetch file data using the useListFileData hook
  // const { data, isLoading, isError, refetch } = useListCandidateData((currentPage + 1), pageSize);
  const { data, isLoading, isError, isPreviousData, refetch } =
    useListCandidateData(currentPage + 1, pageSize);

  // Create a function to periodically refetch data
  const startAutoRefresh = () => {
    const interval = 1000; // 3 seconds in milliseconds

    const refreshData = () => {
      refetch();
    };

    const refreshInterval = setInterval(refreshData, interval);

    // Return a function to clear the interval when needed
    return () => {
      clearInterval(refreshInterval);
    };
  };

  // Call startAutoRefresh when the component mounts
  useEffect(() => {
    const stopAutoRefresh = startAutoRefresh();

    // Return a cleanup function to clear the interval when the component unmounts
    return () => {
      stopAutoRefresh();
    };
  }, []); // The empty dependency array ensures this effect runs only once when the component mounts

  const showModalDelete = async (fileId: string, fileName: string) => {
    await setFileId(fileId);
    await setFileName(fileName);
    setIsOpenModalDelete(true);
  };

  const closeModal = () => {
    setIsOpenModalDelete(false);
  };

  const handleDeleteFile = () => {
    deleteFile(
      {},
      {
        onError: async (error: any) => {
          console.log("Delete file error:", error.response.status);
          setIsOpenModalDelete(false);
          toast.error("Delete file failed");
        },
        onSuccess: async () => {
          setIsOpenModalDelete(false);
          props2.refetch();
          toast.success("Delete file success");
        },
      }
    );
  };

  const columnHelper = createColumnHelper<CandidateModel>();
  const columns = [
    columnHelper.display({
      header: "ID",
      cell: ({ row }: { row: Row<any> }) => {
        return (
          <div>
            {currentPage !== 0 ? (
              <>{currentPage * 10 + (row.index + 1)}</>
            ) : (
              <>{row.index + 1}</>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor("candidate_name", {
      header: "Candidate Name",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("email", {
      header: "Email Address",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("phone_number", {
      header: "Phone Number",
      cell: (props) => props.getValue(),
    }),
    columnHelper.accessor("cv_name", {
      header: "Candidate CV Name",
      cell: (props) => props.getValue(),
    }),
    // columnHelper.accessor("cv_date", {
    //   header: "Candidate Created Date",
    //   cell: (props) => {
    //     return <div className="truncate">{props.getValue()}</div>;
    //   },
    // }),
    columnHelper.accessor("job_recommended", {
      header: "Recommended Jobs",
      cell: (props: any) => {
        const recommendedJobs = props.getValue();
        return (
          <div>
            {recommendedJobs.map((job: any, index: any) => (
              <span key={index}>
                {job}
                {index !== recommendedJobs.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        );
      },
    }),
    columnHelper.display({
      header: "Action",
      cell: ({ row }: { row: Row<any> }) => {
        return (
          <>
            <button
              className="p-2 text-xs font-medium text-center text-white bg-blue-500 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              value={row.original._id}
              onClick={handleDetail}
            >
              Detail
            </button>
            <button
              className="p-2 ml-2 text-xs font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              value={row.original._id}
              onClick={() =>
                showModalDelete(row.original._id, row.original.cv_name)
              }
            >
              Delete
            </button>
          </>
        );
      },
    }),
  ];

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(event.target.value);
  };

  const handlePageOnchange = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleDrawerClose = () => {
    setIsOpenDrawer(false);
  };

  const handleDetail = async (event: any) => {
    await setFileId(event.target.value);
    await fileDetailQuery.refetch();
    if (fileDetailQuery.isLoading) {
      setIsFetching(true);
    }
    setIsFetching(false);
    setIsOpenDrawer(true);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />

      <UseTableTanStackSSR columns={columns} data={data!.results} />
      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        className="dark:text-white"
        count={data!.total_file}
        page={currentPage}
        onPageChange={handlePageOnchange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Drawer */}
      <Drawer anchor="right" open={isOpenDrawer} onClose={handleDrawerClose}>
        <div className="flex items-center p-2 justify-center bg-blue-700 text-white">
          <div className="text-base font-bold">Detail Analyse Candidate</div>
        </div>
        <div className="w-[500px] text-sm">
          {fetching ? (
            <div className="text-center">Loading ...</div>
          ) : (
            <>
              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Candidate Name
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {fileDetailQuery.data?.candidate_name
                    ? fileDetailQuery.data?.candidate_name
                    : "None"}
                </p>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Candidate Email Address
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {fileDetailQuery.data?.email
                    ? fileDetailQuery.data?.email
                    : "None"}
                </p>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Candidate Phone Number
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {fileDetailQuery.data?.phone_number
                    ? fileDetailQuery.data?.phone_number
                    : "None"}
                </p>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Candidate Summary
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {fileDetailQuery.data?.comment
                    ? fileDetailQuery.data?.comment
                    : "None"}
                </p>

                <div className="text-base font-semibold leading-7 text-gray-900">
                  Recommended Jobs
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {fileDetailQuery.data?.job_recommended
                    ? fileDetailQuery.data?.job_recommended.join(", ")
                    : "None"}
                </p>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Educations
                </div>
                <ul className="list-disc pl-6 text-sm leading-6 text-gray-600">
                  {(fileDetailQuery.data?.degree || []).length > 0 ? (
                    fileDetailQuery.data?.degree.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))
                  ) : (
                    <li>None</li>
                  )}
                </ul>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Experiences
                </div>
                <ul className="list-disc pl-6 text-sm leading-6 text-gray-600">
                  {(fileDetailQuery.data?.experience || []).length > 0 ? (
                    fileDetailQuery.data?.experience.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))
                  ) : (
                    <li>None</li>
                  )}
                </ul>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Responsibilities
                </div>
                <ul className="list-disc pl-6 text-sm leading-6 text-gray-600">
                  {(fileDetailQuery.data?.responsibility || []).length > 0 ? (
                    fileDetailQuery.data?.responsibility.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))
                  ) : (
                    <li>None</li>
                  )}
                </ul>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Technicall Skills
                </div>
                <div className="px-2 max-w-[500px]">
                  {(fileDetailQuery.data?.technical_skill || []).length > 0 ? (
                    <div className="flex flex-wrap">
                      {fileDetailQuery.data?.technical_skill.map(
                        (edu, index) => (
                          <span
                            className="rounded-full bg-blue-500 text-white px-2 py-1 m-1"
                            key={index}
                          >
                            {edu.replace(/\s/g, "")}
                          </span>
                        )
                      )}
                    </div>
                  ) : (
                    <div>None</div>
                  )}
                </div>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Soft Skills
                </div>
                <ul className="list-disc pl-6 text-sm leading-6 text-gray-600">
                  {(fileDetailQuery.data?.soft_skill || []).length > 0 ? (
                    fileDetailQuery.data?.soft_skill.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))
                  ) : (
                    <li>None</li>
                  )}
                </ul>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Certificates
                </div>
                <ul className="list-disc pl-6 text-sm leading-6 text-gray-600">
                  {(fileDetailQuery.data?.certificate || []).length > 0 ? (
                    fileDetailQuery.data?.certificate.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))
                  ) : (
                    <li>None</li>
                  )}
                </ul>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Candidate CV Name
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {fileDetailQuery.data?.cv_name
                    ? fileDetailQuery.data?.cv_name
                    : "None"}
                </p>

                <div className="mt-2 text-base font-semibold leading-7 text-gray-900">
                  Candidate Created Date
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {fileDetailQuery.data?.created_at
                    ? fileDetailQuery.data?.created_at
                    : "None"}
                </p>
              </div>
            </>
          )}
        </div>
      </Drawer>

      {/* Modal confirm delete */}
      <Transition appear show={isOpenModalDelete} as={React.Fragment}>
        <Dialog as="div" className="relative z-20" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Notification
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      Are you sure delete file <strong>{fileName}</strong> ?
                    </p>
                  </div>

                  <div className="mt-8 text-end">
                    <button
                      type="button"
                      className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => handleDeleteFile()}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      No
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* Modal edit role */}
    </>
  );
};

export default TableCandidates;
