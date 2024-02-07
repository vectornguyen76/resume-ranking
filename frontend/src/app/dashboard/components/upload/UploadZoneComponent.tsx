"use client";
import React, { ChangeEvent, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import Image from "next/image";
import { Button, Typography } from "@mui/material";
import { useUploadFileData } from "@/app/hooks/react-query/management/file/useFilesUploadData";
import { ToastContainer, toast } from "react-toastify";
import { MdOutlineCloudUpload, MdClear } from "react-icons/md";

type Props = {
  refetch: () => void;
};

const UploadZoneComponent = (props: Props) => {
  const [file, setFile] = useState<File[] | []>([]);
  const [errorContent, setErrorContent] = useState<string | null>(null);
  const [isUpload, setIsUpload] = useState<boolean>(false);

  const {
    mutate: uploadFile,
    isError,
    error,
    isSuccess,
    data,
    isLoading,
  } = useUploadFileData(file);

  // Submit upload
  const handleSubmitUpload = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!file) {
      return;
    }
    setIsUpload(true);
    await uploadFile(
      {
        file_upload: file,
      },
      {
        onError: (error: any) => {
          console.log("Upload error:", error.response.status);
          if (error.response.status === 409) {
            setErrorContent("File is duplicate");
            toast.warning("File is duplicate");
          } else {
            setErrorContent("Upload file failed");
            toast.error("Upload file failed");
          }
          setIsUpload(false);
        },
        onSuccess: async () => {
          await setFile([]);
          props.refetch();
          toast.success("Upload file success");
          setIsUpload(false);
        },
      }
    );
  };

  const handleChangeUploadFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    const newFile = [...file];

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        newFile.push(selectedFiles[i]);
      }

      setFile(newFile);
    }
  };

  const clearFile = () => {
    setFile([]);
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
      <div id="upload-zone">
        <div className="bg-white dark:bg-gray-400 rounded w-full mx-auto">
          <div className="relative flex flex-col p-4 text-gray-400 border border-gray-200 rounded">
            <form onSubmit={handleSubmitUpload}>
              {isUpload ? (
                <>
                  <div className="text-center mt-4 mb-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400 transition ease-in-out duration-150 cursor-not-allowed"
                      disabled
                    >
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative flex flex-col text-gray-400 border border-gray-200 border-dashed rounded cursor-pointer hover:bg-gray-300 hover:dark:bg-gray-800">
                    <input
                      accept="*"
                      type="file"
                      className="absolute inset-0 z-50 w-full h-full p-0 m-0 outline-none opacity-0 cursor-pointer"
                      onChange={handleChangeUploadFile}
                      id="file-input"
                      multiple // Add the multiple attribute to accept multiple files
                    />

                    <div className="flex flex-row items-center justify-center py-10 text-center z-10">
                      {file.length !== 0 ? (
                        file.map((file) => (
                          <>
                            <div className="flex flex-col ml-2 mr-2 justify-center items-center border w-2/12">
                              <Image
                                src="/media/svg/file-icon.svg"
                                alt="File Upload"
                                width={50}
                                height={30}
                              />
                              <div className="text-sm dark:text-white w-1/2">
                                <Typography noWrap gutterBottom>
                                  {file.name}
                                </Typography>
                              </div>
                            </div>
                          </>
                        ))
                      ) : (
                        <div className="flex text-center">
                          <FaRegFilePdf className="dark:text-white w-6 h-6 mr-2" />
                          <p className="dark:text-white font-bold">
                            Drag your files here or click in this area{"\n"}
                            PDF and DOCX formats are avaliable.
                          </p>
                        </div>
                      )}
                      <div className="text-center text-red-500 font-bold">
                        {errorContent}
                      </div>
                    </div>
                  </div>
                </>
              )}
              {file && !isUpload && (
                <div className="pt-4 flex justify-center items-start text-center">
                  <button
                    className="p-2 flex text-xs font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover-bg-green-700 dark:focus:ring-green-800"
                    type="submit"
                  >
                    <MdOutlineCloudUpload
                      style={{ fontSize: "18px" }}
                      className="mr-2"
                    />{" "}
                    Upload
                  </button>
                  <button
                    className="p-2 flex text-xs font-medium text-center text-white bg-red-500 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 ml-4"
                    type="button"
                    onClick={clearFile}
                  >
                    <MdClear style={{ fontSize: "18px" }} className="mr-2" />{" "}
                    Clear
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadZoneComponent;
