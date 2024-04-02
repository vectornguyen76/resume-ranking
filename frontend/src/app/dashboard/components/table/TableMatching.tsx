"use client";
import React, { useState, useEffect } from "react";

import { createColumnHelper, Row } from "@tanstack/react-table";
import { TablePagination, Drawer } from "@mui/material";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import UseTableTanStackSSR from "@/app/hooks/react-table/useTableTanStackSSR";
import { Menu, Dialog, Transition } from "@headlessui/react";
import {
  useMachingData,
  useFAQData,
  useMatchingPageData,
  useAllJobData,
  useDetailFAQData,
  useDeleteFAQData,
  useAddFAQData,
  useUpdateFAQData,
} from "@/app/hooks/react-query/logging/faq/useFAQData";
import { useMatchingDetailData } from "@/app/hooks/react-query/management/file/useFilesUploadData";

import { BsChevronDown } from "react-icons/bs";
import { MdLightbulbOutline, MdLightbulb } from "react-icons/md";

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {};

interface InputItem {
  documentname: string;
  page: number;
}

type FormModel = {
  job_name: string;
  job_description: string;
};

interface DataFormModel {
  _id?: number;
  job_name: string;
  job_description: string;
}

const TableFAQ = (props: Props) => {
  const [currentPage, setCurrentPage] = React.useState<number>(0);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [isOpenDrawer, setIsOpenDrawer] = React.useState<boolean>(false);
  const [isOpenModalDelete, setIsOpenModalDelete] =
    React.useState<boolean>(false);
  const [isOpenModalAdd, setIsOpenModalAdd] = React.useState<boolean>(false);
  const [isOpenModalUpdate, setIsOpenModalUpdate] =
    React.useState<boolean>(false);
  const [fetching, setIsFetching] = React.useState<boolean>(false);
  const [faqId, setFaqId] = React.useState<number>(-1);
  const [inputs, setInputs] = React.useState<InputItem[] | []>([]);
  const [CandidateId, setCandidateId] = React.useState<string>("id");
  const [selectedJobId, setSelectedJobId] = React.useState<string>("id");
  const candidateDetailQuery = useMatchingDetailData(
    CandidateId,
    selectedJobId
  );
  const [loadingMatching, setLoadingMatching] = React.useState<boolean>(false);

  const [dataForm, setDataForm] = React.useState<DataFormModel>({
    job_name: "",
    job_description: "",
  });

  // const { data, isLoading, isError, isPreviousData, refetch } = useFAQData((currentPage + 1), pageSize);
  // const { data: detailFAQData, isLoading: isDetailFAQLoading, refetch: refetchDetailFAQData, isSuccess } = useDetailFAQData(faqId);
  const { data: detailAllJobData } = useAllJobData();

  const { mutate: deleteFAQ } = useDeleteFAQData(faqId);
  const { mutate: addFAQ } = useAddFAQData(dataForm);
  const { mutate: updateFAQ } = useUpdateFAQData(dataForm, faqId);

  // Define a state variable to store the selected job name
  const [selectedJobName, setSelectedJobName] =
    useState<string>("Position Name");
  const { mutate: processMatching } = useMachingData(selectedJobName);
  const { data, isLoading, isError, isPreviousData, refetch } =
    useMatchingPageData(selectedJobName, currentPage + 1, pageSize);

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

  // Handle item selection
  const handleMenuItemClick = async (jobId: string, jobName: string) => {
    await setSelectedJobId(jobId);
    await setSelectedJobName(jobName);

    // Call refetch to fetch data for the newly selected job
    refetch();
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormModel>({
    defaultValues: {},
  });

  const handlePageOnchange = (event: any, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPageSize(event.target.value);
  };
  const handleDrawerClose = () => {
    setIsOpenDrawer(false);
  };

  const handleDetail = async (candidateId: string, jobId: string) => {
    await setCandidateId(candidateId);
    await setSelectedJobId(jobId);

    await candidateDetailQuery.refetch();
    if (candidateDetailQuery.isLoading) {
      setIsFetching(true);
    }
    setIsFetching(false);
    setIsOpenDrawer(true);
  };

  // const columnHelper = createColumnHelper<FAQModel>();
  const columnHelper = createColumnHelper<JobMatchingModel>();
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
    columnHelper.display({
      header: "Candidate Name",
      cell: ({ row }: { row: Row<any> }) => {
        return <>{row.original.candidate_name}</>;
      },
    }),
    columnHelper.display({
      header: "Email Address",
      cell: ({ row }: { row: Row<any> }) => {
        return <>{row.original.candidate_email}</>;
      },
    }),
    columnHelper.accessor("comment", {
      header: "Comment",
      cell: ({ row }: { row: Row<any> }) => {
        const [showFullContent, setShowFullContent] = React.useState(false);
        if (!row.original.comment) {
          return null;
        }
        const content = showFullContent
          ? row.original.comment
          : row.original.comment.slice(0, 200);
        return (
          <>
            <div
              className="whitespace-pre-line text-left"
              id="answer"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {row.original.comment.length > 200 && (
              <button
                className="text-blue-500 hover:underline focus:outline-none"
                onClick={() => setShowFullContent(!showFullContent)}
              >
                {showFullContent ? "Show less" : "Show more"}
              </button>
            )}
          </>
        );
      },
    }),

    columnHelper.accessor("score", {
      header: "Matching Score",
      // cell: (props) => props.getValue(),

      cell: (props) => {
        const defaltscore = props.getValue();
        let textColor = "text-red-500"; // Default to red

        // Cast score to a number
        const score = Number(defaltscore);

        switch (true) {
          case score < 40:
            textColor = "text-red-500";
            break;
          case score >= 40 && score < 50:
            textColor = "text-orange-500";
            break;
          case score >= 50 && score < 60:
            textColor = "text-yellow-500";
            break;
          case score >= 60 && score < 70:
            textColor = "text-blue-500"; // You can choose a different color
            break;
          default:
            textColor = "text-green-500"; // Highest score is green
            break;
        }
        return (
          // <div className={`text-sm font-semibold ${textColor}`}>
          //   {score}%
          // </div>
          <div className={`text-sm font-semibold ${textColor}`}>
            {selectedJobName === "Position Name" ? null : `${score}%`}
          </div>
        );
      },
    }),
    columnHelper.display({
      header: "Status",
      cell: ({ row }: { row: Row<any> }) => {
        // Determine the CSS class based on the matching_status
        const statusClass = row.original.matching_status
          ? "bg-green-400"
          : "bg-red-400";
        // Convert matching_status to a string
        const statusString = row.original.matching_status
          ? "Matched"
          : "Pending";

        return (
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-gray-100 ${statusClass}`}
          >
            {statusString}
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
              value={row.original.id}
              onClick={() => handleDetail(row.original.id, selectedJobId)}
            >
              Detail
            </button>
            {/*
            <button className="p-2 mr-2 text-xs font-medium text-center text-white bg-blue-700 rounded-sm hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => handleModifyFAQ(row.original.id)}>
              Update
            </button> */}
            {/* <button className="p-2 text-xs font-medium text-center text-white bg-red-700 rounded-sm hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800" onClick={() => handleDeleteFAQ(row.original.id)}>
              Delete
            </button> */}
          </>
        );
      },
    }),
  ];

  if (isLoading) {
    return (
      <div className="px-4 pt-6 mt-2">
        <div className="font-medium text-xl p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-white dark:border-gray-700 sm:p-6 dark:bg-gray-800">
          <h4 className="animate-pulse text-center text-blue-500">
            Loading ...
          </h4>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <h4 className="text-center text-red-500 font-medium text-xl">
        System Error Please Try Again Later !
      </h4>
    );
  }

  const handleMatchingCandidate = async () => {
    if (selectedJobName !== "Position Name") {
      setLoadingMatching(true);

      processMatching(
        {},
        {
          onError: (error: any) => {
            // console.log('Matching error:', error.response.status);
            setLoadingMatching(false);
            toast.error("Process Matching Candidate failed");
          },
          onSuccess: async () => {
            setLoadingMatching(false);
            setIsOpenModalAdd(false);
            setInputs([]);
            refetch();
            reset();
            toast.success("Process Matching Candidate success");
          },
        }
      );
    }
  };

  const confirmDeleteFAQ = () => {
    deleteFAQ(
      {},
      {
        onError: (error: any) => {
          console.log("Delete FAQ error:", error.response.status);
          setIsOpenModalDelete(false);
          toast.error("Delete FAQ Failed");
        },
        onSuccess: async () => {
          setIsOpenModalDelete(false);
          refetch();
          toast.success("Delete FAQ success");
        },
      }
    );
  };

  // if (isSuccess) {
  //   setValue2('job_name', detailFAQData.job_name)
  //   setValue2('job_description', detailFAQData.job_description)
  // }

  //Submit form add FAQ
  const confirmAddFAQ = async (data: FormModel): Promise<void> => {
    const params = {
      job_name: data.job_name,
      job_description: data.job_description,
    };

    if (
      Array.isArray(inputs) &&
      inputs.every((input) => input.documentname.trim().length > 0)
    ) {
      // params.documents = inputs.map((input) => ({
      //   page: input.page.toString(),
      //   document: input.documentname,
      // }));
      alert("oke");
    } else {
      alert("Document name is required.");
      return;
    }
    console.log(params);
    await setDataForm(params);

    addFAQ(
      {},
      {
        onError: (error: any) => {
          console.log("Matching error:", error.response.status);
          toast.error("Matching failed");
        },
        onSuccess: async () => {
          setIsOpenModalAdd(false);
          setInputs([]);
          refetch();
          reset();
          toast.success("Matching successfully");
        },
      }
    );
  };

  //Submit form update FAQ
  const confirmUpdateFAQ = async (data: FormModel) => {
    const params = {
      job_name: data.job_name,
      job_description: data.job_description,
    };

    await setDataForm(params);
    console.log(params);
    updateFAQ(
      {},
      {
        onError: (error: any) => {
          console.log("Update FAQ error:", error.response.status);
          toast.success("Update FAQ failed");
        },
        onSuccess: async () => {
          setIsOpenModalUpdate(false);
          setInputs([]);
          refetch();
          reset();
          toast.success("Update FAQ success");
        },
      }
    );
  };

  const handleDeleteFAQ = (faqId: number) => {
    setIsOpenModalDelete(true);
    setFaqId(faqId);
  };

  const closeModal = () => {
    setIsOpenModalDelete(false);
    setIsOpenModalAdd(false);
    setIsOpenModalUpdate(false);
    setInputs([]);
    reset();
  };

  const validateDocumentName = (documentname: string) => {
    return documentname.trim().length > 0;
  };

  const addInput = (): void => {
    setInputs([...inputs, { documentname: "", page: 0 }]);
  };

  const handleInputChange = (index: number, event: any) => {
    const { name, value } = event.target;
    const updatedInputs = [...inputs];
    updatedInputs[index] = { ...updatedInputs[index], [name]: value };
    setInputs(updatedInputs);
  };

  // Cast score to a number
  const score = Number(candidateDetailQuery.data?.score);
  let textColor = "text-red-500"; // Default to red
  switch (true) {
    case score < 40:
      textColor = "text-red-500";
      break;
    case score >= 40 && score < 50:
      textColor = "text-orange-500";
      break;
    case score >= 50 && score < 60:
      textColor = "text-yellow-500";
      break;
    case score >= 60 && score < 70:
      textColor = "text-blue-500"; // You can choose a different color
      break;
    default:
      textColor = "text-green-500"; // Highest score is green
      break;
  }

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
      <div className="flex pr-20 justify-between">
        <button
          type="button"
          className={`flex mb-4 px-3 py-2 text-sm font-medium text-center text-white rounded-lg focus:outline-none ${
            loadingMatching
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          }`}
          onClick={() => handleMatchingCandidate()}
          disabled={loadingMatching}
        >
          {loadingMatching ? (
            <MdLightbulb style={{ fontSize: "18px" }} className="mr-2" />
          ) : (
            <MdLightbulbOutline style={{ fontSize: "18px" }} className="mr-2" />
          )}
          {loadingMatching ? "Matching..." : "Match"}
        </button>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {selectedJobName} {/* Display the selected job name */}
              <BsChevronDown
                className="-mr-1 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {detailAllJobData?.map((item) => (
                  <Menu.Item key={item._id}>
                    {({ active }) => (
                      <a
                        href="#"
                        onClick={() =>
                          handleMenuItemClick(item._id, item.job_name)
                        } // Handle item click
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {item.job_name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <br />
      {/* Table */}
      <UseTableTanStackSSR columns={columns} data={data.results} />

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[10, 20, 30]}
        component="div"
        className="dark:text-white"
        count={data.total_matching}
        page={currentPage}
        onPageChange={handlePageOnchange}
        rowsPerPage={pageSize}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Modal delete */}
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
                      Bạn chắc chắn muốn xóa Job này không?
                    </p>
                  </div>

                  <div className="mt-8 text-end">
                    <button
                      type="button"
                      className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => confirmDeleteFAQ()}
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

      {/* Modal Add FAQ */}
      <Transition appear show={isOpenModalAdd} as={React.Fragment}>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Create New Job
                  </Dialog.Title>
                  <form
                    className="w-full"
                    onSubmit={handleSubmit(confirmAddFAQ)}
                  >
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5 mt-8">
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Job Name
                        </label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          {...register("job_name")}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                      <div className="sm:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Job Description
                        </label>
                        <input
                          type="text"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                          {...register("job_description")}
                        />
                      </div>
                    </div>

                    <div className="mt-8 text-end">
                      <button
                        type="submit"
                        className="mr-2 inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
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
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Drawer */}
      <Drawer anchor="right" open={isOpenDrawer} onClose={handleDrawerClose}>
        <div className="flex items-center p-2 justify-center bg-blue-700 text-white">
          <div className="text-base font-bold">
            Detail Analyse Matching Candidate
          </div>
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
                  {candidateDetailQuery.data?.candidate_name
                    ? candidateDetailQuery.data?.candidate_name
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Candidate Phone Number
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {candidateDetailQuery.data?.phone_number
                    ? candidateDetailQuery.data?.phone_number
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Candidate CV Name
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {candidateDetailQuery.data?.cv_name
                    ? candidateDetailQuery.data?.cv_name
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Job Name
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {candidateDetailQuery.data?.job_name
                    ? candidateDetailQuery.data?.job_name
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Matching Score
                </div>
                <p className={`text-sm font-semibold leading-6 ${textColor}`}>
                  {candidateDetailQuery.data?.score
                    ? candidateDetailQuery.data?.score
                    : "0"}
                  %
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Summary Analyse Candidate
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {candidateDetailQuery.data?.summary_comment
                    ? candidateDetailQuery.data?.summary_comment
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Recommended Jobs
                </div>
                <p className="text-sm leading-6 text-gray-60">
                  {candidateDetailQuery.data?.job_recommended
                    ? candidateDetailQuery.data?.job_recommended
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Analyse Educations
                </div>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Comment:{" "}
                  {candidateDetailQuery.data?.degree.comment
                    ? candidateDetailQuery.data?.degree.comment
                    : "None"}
                </p>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Score:{" "}
                  {candidateDetailQuery.data?.degree.score
                    ? candidateDetailQuery.data?.degree.score
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Experiences
                </div>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Comment:{" "}
                  {candidateDetailQuery.data?.experience.comment
                    ? candidateDetailQuery.data?.experience.comment
                    : "None"}
                </p>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Score:{" "}
                  {candidateDetailQuery.data?.experience.score
                    ? candidateDetailQuery.data?.experience.score
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Responsibilities
                </div>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Comment:{" "}
                  {candidateDetailQuery.data?.responsibility.comment
                    ? candidateDetailQuery.data?.responsibility.comment
                    : "None"}
                </p>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Score:{" "}
                  {candidateDetailQuery.data?.responsibility.score
                    ? candidateDetailQuery.data?.responsibility.score
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Technicall Skills
                </div>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Comment:{" "}
                  {candidateDetailQuery.data?.technical_skill.comment
                    ? candidateDetailQuery.data?.technical_skill.comment
                    : "None"}
                </p>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Score:{" "}
                  {candidateDetailQuery.data?.technical_skill.score
                    ? candidateDetailQuery.data?.technical_skill.score
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Soft Skills
                </div>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Comment:{" "}
                  {candidateDetailQuery.data?.soft_skill.comment
                    ? candidateDetailQuery.data?.soft_skill.comment
                    : "None"}
                </p>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Score:{" "}
                  {candidateDetailQuery.data?.soft_skill.score
                    ? candidateDetailQuery.data?.soft_skill.score
                    : "None"}
                </p>
              </div>

              <div className="p-2">
                <div className="text-base font-semibold leading-7 text-gray-900">
                  Certificates
                </div>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Comment:{" "}
                  {candidateDetailQuery.data?.certificate.comment
                    ? candidateDetailQuery.data?.certificate.comment
                    : "None"}
                </p>
                <p className="px-2 text-sm leading-6 text-gray-60">
                  Score:{" "}
                  {candidateDetailQuery.data?.certificate.score
                    ? candidateDetailQuery.data?.certificate.score
                    : "None"}
                </p>
              </div>
            </>
          )}
        </div>
      </Drawer>

      {/* Modal Update FAQ */}
      <Transition appear show={isOpenModalUpdate} as={React.Fragment}>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-lg font-medium leading-6 text-gray-900"
                  >
                    Update Job
                  </Dialog.Title>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default TableFAQ;
